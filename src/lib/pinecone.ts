import { Pinecone } from '@pinecone-database/pinecone';
import { downloadFromS3 } from './s3-server';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { Document, RecursiveCharacterTextSplitter } from '@pinecone-database/doc-splitter';

export const getPineconeClient = () => {
    return new Pinecone({
      environment: process.env.PINECONE_ENVIRONMENT!,
      apiKey: process.env.PINECONE_API_KEY!,
    });
};

type PDFPage = {
    pageContent: string;
    metadata: {
      loc: { pageNumber: number };
    };
  };

export async function loadS3IntoPinecone(fileKey: string) {  // the fileKey is passed from the route.ts.
    // 1. obtaine the pdf -> download and read from pdf
    console.log('downloading s3 into file system');
    const file_name = await downloadFromS3(fileKey);
    if (!file_name) {
        throw new Error('could not donwload the file from s3');
    }
    const loader = new PDFLoader(file_name);
    const pages = (await loader.load()) as PDFPage[];

    // 2. split and segment the pdf
    const documents = await Promise.all(pages.map(prepareDocument));
}

// Split the string into bytes.
export const truncateStringByBytes = (str: string, bytes: number) => {
    const enc = new TextEncoder();
    return new TextDecoder('utf-8').decode(enc.encode(str).slice(0, bytes));
}

async function prepareDocument(page: PDFPage) {
    let {pageContent, metadata} = page;
    pageContent = pageContent.replace(/\n/g, '');
    // split the docs
    const splitter = new RecursiveCharacterTextSplitter();
    const docs = await splitter.splitDocuments([
        new Document({
            pageContent,
            metadata: {
                pageNumber: metadata.loc.pageNumber,
                text: truncateStringByBytes(pageContent, 36000)
            }
        })
    ]);
    return docs;
}