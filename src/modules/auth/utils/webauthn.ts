import {
  decodeBase64ToArrayBuffer,
  encodeArrayBufferToBase64,
} from '@/modules/shared/utils/base64.ts';

const prepareCreationOptions = (
  optionsJSON: PublicKeyCredentialCreationOptionsJSON
): PublicKeyCredentialCreationOptions => {
  const { challenge, user, excludeCredentials, extensions, ...rest } =
    optionsJSON;

  return {
    ...rest,
    challenge: decodeBase64ToArrayBuffer(challenge),
    user: {
      ...user,
      id: decodeBase64ToArrayBuffer(user.id),
    },
    excludeCredentials: excludeCredentials?.map(credential => ({
      ...credential,
      id: decodeBase64ToArrayBuffer(credential.id),
    })),
    extensions: extensions as AuthenticationExtensionsClientInputs,
  };
};

const prepareRequestOptions = (
  optionsJSON: PublicKeyCredentialRequestOptionsJSON
): PublicKeyCredentialRequestOptions => {
  const { challenge, allowCredentials, extensions, ...rest } = optionsJSON;

  return {
    ...rest,
    challenge: decodeBase64ToArrayBuffer(challenge),
    allowCredentials: allowCredentials?.map(credential => ({
      ...credential,
      id: decodeBase64ToArrayBuffer(credential.id),
    })),
    extensions: extensions as AuthenticationExtensionsClientInputs,
  };
};

const isWebAuthnSupported = (): boolean => {
  return (
    typeof window !== 'undefined' &&
    typeof window.PublicKeyCredential !== 'undefined'
  );
};

const isConditionalMediationAvailable = async (): Promise<boolean> => {
  if (!isWebAuthnSupported()) {
    return false;
  }

  const supportsConditionalMediation =
    'isConditionalMediationAvailable' in PublicKeyCredential;

  if (!supportsConditionalMediation) {
    return false;
  }

  try {
    return await (
      PublicKeyCredential as unknown as {
        isConditionalMediationAvailable: () => Promise<boolean>;
      }
    ).isConditionalMediationAvailable();
  } catch {
    return false;
  }
};

export type PublicKeyCredentialUserEntityJSON = Omit<
  PublicKeyCredentialUserEntity,
  'id'
> & {
  id: string;
};

export type PublicKeyCredentialDescriptorJSON = Omit<
  PublicKeyCredentialDescriptor,
  'id'
> & {
  id: string;
};

export type PublicKeyCredentialCreationOptionsJSON = Omit<
  PublicKeyCredentialCreationOptions,
  'challenge' | 'user' | 'excludeCredentials' | 'extensions'
> & {
  challenge: string;
  user: PublicKeyCredentialUserEntityJSON;
  excludeCredentials?: PublicKeyCredentialDescriptorJSON[];
  extensions?: AuthenticationExtensionsClientInputs;
};

export type PublicKeyCredentialRequestOptionsJSON = Omit<
  PublicKeyCredentialRequestOptions,
  'challenge' | 'allowCredentials' | 'extensions'
> & {
  challenge: string;
  allowCredentials?: PublicKeyCredentialDescriptorJSON[];
  extensions?: AuthenticationExtensionsClientInputs;
};

export interface RegistrationResponseJSON {
  id: string;
  rawId: string;
  type: PublicKeyCredentialType;
  clientExtensionResults: AuthenticationExtensionsClientOutputs;
  authenticatorAttachment?: AuthenticatorAttachment;
  response: {
    attestationObject: string;
    clientDataJSON: string;
    transports?: AuthenticatorTransport[];
  };
}

export interface AuthenticationResponseJSON {
  id: string;
  rawId: string;
  type: PublicKeyCredentialType;
  clientExtensionResults: AuthenticationExtensionsClientOutputs;
  authenticatorAttachment?: AuthenticatorAttachment;
  response: {
    authenticatorData: string;
    clientDataJSON: string;
    signature: string;
    userHandle?: string;
  };
}

interface StartRegistrationParams {
  optionsJSON: PublicKeyCredentialCreationOptionsJSON;
  useAutoRegister?: boolean;
}

interface StartAuthenticationParams {
  optionsJSON: PublicKeyCredentialRequestOptionsJSON;
  useBrowserAutofill?: boolean;
}

export const startRegistration = async ({
  optionsJSON,
  useAutoRegister = false,
}: StartRegistrationParams): Promise<RegistrationResponseJSON> => {
  if (!isWebAuthnSupported()) {
    throw new Error('WebAuthn is not supported in this browser');
  }

  const publicKey = prepareCreationOptions(optionsJSON);
  const credentialCreationOptions: CredentialCreationOptions = {
    publicKey,
  };

  if (useAutoRegister) {
    (
      credentialCreationOptions as CredentialCreationOptions & {
        mediation?: CredentialMediationRequirement;
      }
    ).mediation = 'optional';
  }

  const credential = (await navigator.credentials.create(
    credentialCreationOptions
  )) as PublicKeyCredential | null;

  if (!credential) {
    throw new Error('Credential creation was not completed');
  }

  const response = credential.response as AuthenticatorAttestationResponse;

  return {
    id: credential.id,
    rawId: encodeArrayBufferToBase64(credential.rawId),
    type: credential.type as PublicKeyCredentialType,
    authenticatorAttachment: (credential.authenticatorAttachment ??
      undefined) as AuthenticatorAttachment,
    clientExtensionResults: credential.getClientExtensionResults(),
    response: {
      attestationObject: encodeArrayBufferToBase64(response.attestationObject),
      clientDataJSON: encodeArrayBufferToBase64(response.clientDataJSON),
      transports: response.getTransports?.() as AuthenticatorTransport[],
    },
  };
};

export const startAuthentication = async ({
  optionsJSON,
  useBrowserAutofill = false,
}: StartAuthenticationParams): Promise<AuthenticationResponseJSON> => {
  if (!isWebAuthnSupported()) {
    throw new Error('WebAuthn is not supported in this browser');
  }

  const publicKey = prepareRequestOptions(optionsJSON);
  const credentialRequestOptions: CredentialRequestOptions = {
    publicKey,
  };

  if (useBrowserAutofill && (await isConditionalMediationAvailable())) {
    (
      credentialRequestOptions as CredentialRequestOptions & {
        mediation?: CredentialMediationRequirement;
      }
    ).mediation = 'required';
  }

  const credential = (await navigator.credentials.get(
    credentialRequestOptions
  )) as PublicKeyCredential | null;

  if (!credential) {
    throw new Error('Credential retrieval was not completed');
  }

  const response = credential.response as AuthenticatorAssertionResponse;

  return {
    id: credential.id,
    rawId: encodeArrayBufferToBase64(credential.rawId),
    type: credential.type as PublicKeyCredentialType,
    authenticatorAttachment: (credential.authenticatorAttachment ??
      undefined) as AuthenticatorAttachment,
    clientExtensionResults: credential.getClientExtensionResults(),
    response: {
      authenticatorData: encodeArrayBufferToBase64(response.authenticatorData),
      clientDataJSON: encodeArrayBufferToBase64(response.clientDataJSON),
      signature: encodeArrayBufferToBase64(response.signature),
      userHandle: response.userHandle
        ? encodeArrayBufferToBase64(response.userHandle)
        : undefined,
    },
  };
};

export const webAuthnUtils = {
  startRegistration,
  startAuthentication,
};
