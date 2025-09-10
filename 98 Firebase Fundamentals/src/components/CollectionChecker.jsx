import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";

export default function CollectionChecker() {
    const [status, setStatus] = useState("Checking...");
    const [allDocs, setAllDocs] = useState([]);

    // Function to check if collection "siteId-1077" exists

    const checkCollection = async () => {
        try {
            const colReference = collection(db, "siteId-1077");
            const colSnapshot = await getDocs(colReference);

            if (colSnapshot.empty) {
                setStatus("Collection does not exist. Creating...");

                //  create one doc inside "siteId-1077" collection
                await setDoc(doc(colReference, "conversations"), {
                    createdAt: new Date(),
                });

                setStatus("Collection created successfully");
            } else {
                setStatus(`Collection has ${colSnapshot.size} documents`);
            }
        } catch (error) {
            console.error("Error checking collection: ", error);
            setStatus("Error checking collection");
        }
    };

    const listDocuments = async () => {
        try {
            const colReference = collection(db, "siteId-1077");
            const snapshot = await getDocs(colReference);

            if (snapshot.empty) {
                console.log("No documents found in the collection.");
                setAllDocs([]);
            } else {
                const results = snapshot.docs.map((doc) => (
                    {
                        id: doc.id,
                        ...doc.data()
                    }
                ));
                setAllDocs(results);
                console.log("Documents in the collection: ", results);
            }
        } catch (error) {
            console.error("Error listing documents: ", error);
        }

    }

    useEffect(() => {
        checkCollection();
        listDocuments();
    }, []);

    return (
        <div>
            <h1>Collection Checker</h1>
            <p>{status}</p>
            {allDocs.length > 0 && (
                <div>
                    <h2>Documents in "siteId-1077" Collection:</h2>
                    <ul>
                        {allDocs.map((doc) => (
                            <li key={doc.id}>
                                <strong>ID:</strong> {doc.id}, <strong>Data:</strong> {JSON.stringify(doc)}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
