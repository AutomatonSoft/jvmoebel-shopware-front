const revocationRecipient = "info@jvmoebel.de";

export type ContractRevocationData = {
  contractId: string;
  email: string;
  name: string;
  reason?: string;
};

export function buildContractRevocationMailto({
  contractId,
  email,
  name,
  reason,
}: ContractRevocationData) {
  const subject = `Widerruf – ${contractId}`;
  const body = [
    "Hiermit widerrufe ich den folgenden Vertrag:",
    "",
    `Name: ${name}`,
    `Vertragsidentifikation: ${contractId}`,
    `E-Mail-Adresse: ${email}`,
    ...(reason ? [`Widerrufsgrund: ${reason}`] : []),
  ].join("\n");

  return `mailto:${revocationRecipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
