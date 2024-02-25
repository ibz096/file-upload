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

function createTableData(data, tableRow) {
    let tableData = document.createElement('td');
    tableData.textContent = data;
    tableData.classList.add("p-4", "align-middle", "[&:has([role=checkbox])]:pr-0", "font-medium");
    return tableData
}

// Function to create modal content
function updateModalFilename(filename) {
    let modalLabel = document.querySelector('#modal-test label[for="filename"]');
    modalLabel.textContent = `Filename: ${filename}`;
}

function createTableRow(tableName, fileData) {
    let table = document.getElementById(tableName);
    //Create tr Element
    let tableRow = document.createElement('tr');
    tableRow.classList.add('border-b', 'transition-colors', 'hover:bg-muted/50', 'data-state', 'selected');
    //Create td in each tr (table row)
    //FileName
    let tableDataFileName = tableRow.appendChild(createTableData(fileData.filename, tableRow));
    let tableDataFileSize = tableRow.appendChild(createTableData('size', tableRow));
    let tableDataFileTimestamp = tableRow.appendChild(createTableData(fileData.timestamp, tableRow));
    let tableDataFileLink = tableRow.appendChild(createTableData('TBD'));
    //Create buttons in each tr (table row)
    let tableDataButtons = document.createElement('td');
    let shareButton = document.createElement('button');
    shareButton.classList.add("inline-flex", "items-center", "justify-center", "whitespace-nowrap", "text-sm", "font-medium", "ring-offset-background", "transition-colors", "focus-visible:outline-none", "focus-visible:ring-2", "focus-visible:ring-ring", "focus-visible:ring-offset-2", "disabled:pointer-events-none", "disabled:opacity-50", "border", "border-input", "bg-background", "hover:bg-accent", "hover:text-accent-foreground", "h-9", "rounded-md", "px-3");
    shareButton.textContent = 'Share';
    tableRow.appendChild(tableDataButtons.appendChild(shareButton));

    //Create Modal for each table row / file
    //Add Eventlistners to each Button
    shareButton.addEventListener('click', () => {
        console.log('btton clicked')
        let modal = document.getElementById('modal-test');
        // Get the filename from the current table row
        let filename = fileData.filename;

        // Update modal filename label
        updateModalFilename(filename);

        modal.showModal();

        modal.addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                console.log('Modal is closed');
                modal.close();
            }

        })
    });

    table.appendChild(tableRow)

}

async function renderFileResults(resultsPromiseArray) {
    for (let fileData of await resultsPromiseArray) {
        createTableRow("results-data", fileData)
    }
}

renderFileResults(getFileResults());