import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import path from "path";

const ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDcsInVzZXJuYW1lIjoibWF0dUBnbWFpbC5jb20iLCJpYXQiOjE3MDY1MzY5ODMsImV4cCI6MTczODA3Mjk4M30.CMeNHhwzUmt2hcI9CjJZM6jJ0B_HZaswfNBaGE6Mz4k";
const API_URL = "http://localhost:8000/api";

async function createProducts(id: number, data: Buffer) {
  const body = new FormData();
  const url = `${API_URL}/merchants/products/file`;
  body.append("file", data, { filename: `${id}.csv` });
  body.append("id", id);

  try {
    const res = await axios.post(url, body, {
      headers: {
        ...body.getHeaders(),
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    });
    console.log(`res:${id}`, res.data?.message);
    return res.data;
  } catch (error) {
    console.log(`Error:${id}`, error);
  }
}

type MerchantData = {
  id: number;
  data: Buffer;
};

async function loadData() {
  const pathDirectory = path.resolve("files");
  const filesName = fs.readdirSync(pathDirectory);
  const data: MerchantData[] = [];
  filesName.forEach((name) => {
    const pathFile = path.resolve(pathDirectory, name);
    const bufferData = fs.readFileSync(pathFile);
    data.push({ data: bufferData, id: Number(name.split(".")[0]) });
  });
  return data;
}

async function createProductsFromData() {
  const data = await loadData();
  console.log("Data.length:", data.length);
  for (let i = 0; i < data.length; i++) {
    const merchantDto = data[i];
    await createProducts(merchantDto.id, merchantDto.data);
    console.log("Nro:", i + 1);
    console.log("**********************************");
  }
}

export { createProductsFromData };
