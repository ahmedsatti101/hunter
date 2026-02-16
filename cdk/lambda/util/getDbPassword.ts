import { GetSecretValueCommand, SecretsManagerClient } from "@aws-sdk/client-secrets-manager";

export const getDbPassword = async (region: string, secretId: string): Promise<string | undefined> => {
  const client = new SecretsManagerClient({ region });
  try {
    const res = await client.send(
      new GetSecretValueCommand({
        SecretId: secretId
      })
    );

    if (!res.SecretString) {
      return undefined
    }

    const secret = JSON.parse(res.SecretString);
    return secret.password;
  } catch (error) {
    throw error;
  }
};
