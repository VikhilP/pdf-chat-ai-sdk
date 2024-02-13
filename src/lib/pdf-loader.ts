import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { env } from "./config";
import fs from "fs"

import { promisify } from 'util';

// Promisify fs.readFile
const readFileAsync = promisify(fs.readFile);

export async function getChunkedDocsFromPDF() {
  try {
    const filePath = "./docs/sections.json";
    const filePathTemp = "./docs/temp.json";

    const loader = new PDFLoader(env.PDF_PATH);
    const docs = await loader.load();

    // From the docs https://www.pinecone.io/learn/chunking-strategies/

    //this is normally returned but i needed to send sections itself
    /* const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });

    const chunkedDocs = await textSplitter.splitDocuments(docs); */
    let sections: any[] = [];

    // Read the file asynchronously using Promisify
    const data = await readFileAsync(filePath);
    const gram = JSON.parse(data.toString());
    const keys = Object.keys(gram);

    keys.forEach((k) => {
        sections.push({ "pageContent": JSON.stringify(gram[k]) });
    });

    console.log(sections);
    return sections;

    
    //   fs.writeFile(filePathTemp, JSON.stringify(chunkedDocs), { encoding: "utf-8" }, (err: NodeJS.ErrnoException | null) => {
    //   if (err) {
    //     console.error("Error writing file:", err);
    //   } else {
    //     console.log("File written successfully.");
    //   }
    // });
      //console.log(sections)

    //return []

    
  } catch (e) {
    console.error(e);
    throw new Error("PDF docs chunking failed !");
  }
}
