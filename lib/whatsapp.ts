export const WHATSAPP_NUMBER = "573122475789";

/**
 * Generates a WhatsApp API link with a pre-filled message for booking an experience.
 * @param experienceTitle The title of the experience to book
 * @returns The complete WhatsApp wa.me URL
 */
export function getWhatsAppUrl(experienceTitle: string): string {
    const rawMessage = `Hola, quiero reservar la experiencia ${experienceTitle}`;
    const encodedMessage = encodeURIComponent(rawMessage);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}
