export function createHeart(count) {
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 2;

    const x = 16 * Math.pow(Math.sin(t), 3);

    const y =
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t);

    positions[i * 3] = x * 0.15;
    positions[i * 3 + 1] = y * 0.15;
    positions[i * 3 + 2] = 0;
  }

  return positions;
}

export function createText(text, count) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = 1400;
  canvas.height = 500;

  // background hitam
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // tulisan putih
  ctx.fillStyle = "white";
  ctx.font = "bold 220px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const image = ctx.getImageData(
    0,
    0,
    canvas.width,
    canvas.height
  ).data;

  const pixels = [];

  for (let y = 0; y < canvas.height; y += 2) {
    for (let x = 0; x < canvas.width; x += 2) {
      const index = (y * canvas.width + x) * 4;

      // hanya ambil pixel tulisan putih
      if (image[index] > 200) {
        pixels.push({
          x: (x - canvas.width / 2) / 180,
          y: -(y - canvas.height / 2) / 180,
        });
      }
    }
  }

  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const p =
      pixels[Math.floor(Math.random() * pixels.length)];

    positions[i * 3] = p.x;
    positions[i * 3 + 1] = p.y;
    positions[i * 3 + 2] = 0;
  }

  return positions;
}