// Get PDF context for chat.

import { Pinecone } from "@pinecone-database/pinecone";
import { convertToAscii } from "./utils";
import { getEmbeddings } from "./embeddings";

export async function getMatchesFromEmbeddings(embeddings: number[], fileKey: string) {
    try {
        const client = new Pinecone({
            environment: process.env.PINECONE_ENVIRONMENT!,
            apiKey: process.env.PINECONE_API_KEY!,
        });
        const pineconeIndex = await client.index('chatpdf-rj');
        const namespace = pineconeIndex.namespace(convertToAscii(fileKey));
        const queryResult = await namespace.query({
            topK: 5,
            vector: embeddings,
            includeMetadata: true,
        });
        return queryResult.matches || [];
    }
    catch (error) {
        console.log("error querying embeddings:", error);
        throw error;
    }
}

export async function getContext(query: string, fileKey: string) {
    const queryEmbeddings = await getEmbeddings(query);
    const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileKey);
    // check if queried embeddings are relevant.
    const qualifyingDocs = matches.filter(
        (match) => match.score && match.score > 0.7 // Relevant if match score is over 70%, Not relevant if it is less than 70%.
    );

    // Metadata Type
    type Metadata = {
        text: string,
        pageNumber: number
    };

    let docs = qualifyingDocs.map(match => (match.metadata as Metadata).text);
    // 5 vectors per page
    return docs.join('\n').substring(0, 3000); // Limits characters up to 3000 to prevent overfeeding.
}