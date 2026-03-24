import { generateSocialImage } from "@/lib/og-social-image";

export {
  alt,
  size,
  contentType,
} from "@/lib/og-social-image";

export const runtime = "nodejs";

export default async function Image() {
  return generateSocialImage();
}
