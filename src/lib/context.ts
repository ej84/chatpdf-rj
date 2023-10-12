// Get PDF context for chat.

import { Pinecone } from "@pinecone-database/pinecone";
import { convertToAscii } from "./utils";
import { getEmbeddings } from "./embeddings";

export const getPineconeClient = () => {
    return new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
      environment: process.env.PINECONE_ENVIRONMENT!
    });
};

export async function getMatchesFromEmbeddings(embeddings: number[], fileKey: string) {
    try {
        const index = await getPineconeClient().index('chatpdf-rj');
        const namespace = index.namespace(convertToAscii(fileKey));
        const queryResult = await namespace.query({
            topK: 5,
            vector: embeddings,
            includeMetadata: true
        });
        return queryResult.matches || [];
    }
    catch (error) {
        console.log("error querying embeddings:", error);
        throw error;
    }
}

export async function getContext(query: string, fileKey: string) {

}