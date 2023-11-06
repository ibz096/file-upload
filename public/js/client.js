async function getFileResults() {
    try {
        const response = await fetch('/results');
        if (response.ok) {
            const results = await response.json()
            return results
        }
    } catch (err) {
        console.log(err)
    }
}

async function renderFileResults(resultsPromiseArray) {
    const resultsFileData = document.getElementById("results-data")
    let outputToAppend = ""
    for (let fileData of await resultsPromiseArray) {
        outputToAppend +=
        `<tr>
            <td>${fileData.timestamp}</td>
            <td>${fileData.filename}</td>
            <td>${fileData.link}</td>
            <td>${fileData.expired}</td>
        </tr>
        `
    }
    resultsFileData.innerHTML = outputToAppend
}

const fileResults = getFileResults()

renderFileResults(fileResults);
