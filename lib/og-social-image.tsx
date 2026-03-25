import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";
import sharp from "sharp";

export const alt = "Pensar";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Satori (ImageResponse) only rasterizes PNG/JPEG/WebP/GIF — not SVG data URLs. */
export async function generateSocialImage() {
  const svgBuffer = await readFile(
    join(process.cwd(), "public/logo/logo-negro.svg"),
  );
  const pngBuffer = await sharp(svgBuffer, { density: 300 })
    .resize(420, 528, {
      fit: "contain",
      background: { r: 250, g: 250, b: 250, alpha: 1 },
    })
    .png()
    .toBuffer();
  const src = `data:image/png;base64,${pngBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
        }}
      >
        <img
          src={src}
          width={420}
          height={528}
          alt=""
          style={{ objectFit: "contain" }}
        />
      </div>
    ),
    { ...size },
  );
}
