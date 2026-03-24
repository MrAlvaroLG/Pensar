import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

export const alt = "Pensar";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateSocialImage() {
  const svg = await readFile(
    join(process.cwd(), "public/logo/logo-negro.svg"),
    "utf8",
  );
  const src = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;

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
