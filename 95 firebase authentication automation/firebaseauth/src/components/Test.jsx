export default function Test() {

    /* const projectDetails = {
        "projectId": "vedicview-1077",
        "projectNumber": "809593967707",
        "displayName": "cyberadityacode",
        "name": "projects/vedicview-1077",
        "resources": {
            "hostingSite": "vedicview-1077",
            "realtimeDatabaseInstance": "vedicview-1077-default-rtdb"
        },
        "state": "ACTIVE",
        "etag": "1_21408e8e-9dad-4cac-9177-a2852997562a"
    } */

    const projectDetails = {
        "projectId": "vedicviewastro",
        "projectNumber": "438661684539",
        "displayName": "vedicviewastro",
        "name": "projects/vedicviewastro",
        "resources": {
            "hostingSite": "vedicviewastro"
        },
        "state": "ACTIVE",
        "etag": "1_4da12a6f-531d-4ce8-977e-3ebc079b5a46"
    }

    console.log(projectDetails);
    console.log(projectDetails.hasOwnProperty("resources")); //check whether object has property called resources
    console.log(Object.keys(projectDetails.resources).length);
    console.log(projectDetails.resources.hasOwnProperty("realtimeDatabaseInstance"));

    const handleRTDBInstanceCheck = () => {
        // To check whether RTDB instance exist or not

        alert(projectDetails.resources.hasOwnProperty("realtimeDatabaseInstance") ? "Yes RTDB Exists" : "No RTDB Found");
    }

    const handleFirestoreInstanceCheck = () => {
        // To check whether Firestore instance exists or not
        const hasResources = projectDetails.hasOwnProperty("resources");
        if (!hasResources) {
            alert("No resources found in project details");
            return;
        }

        const hasFirestore = projectDetails.resources.hasOwnProperty("firestoreInstance");
        alert(hasFirestore ? "Yes Firestore Exists" : "No Firestore Found");
    }

    return <div><h1>Test Component</h1>
        <button onClick={handleRTDBInstanceCheck}>Check RTDB Instance</button>
        <button onClick={handleFirestoreInstanceCheck}>Check Firestore Instance</button>
    </div>
}