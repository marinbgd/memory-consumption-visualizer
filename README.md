# Chameleon memory consumption visualizer

## Usage
    * run from command line "node chart.js memory_report.json reports/baseline1.txt"
    * NOTE: file names should be with relative paths
    * build of complete HTML report is created inside /build folder
    * load /build/index.html into a browser
    * HTML report have Time and Occurrences mode
        - Time mode will show time for all records from input files on X axis
        - Occurrences mode will show record number/occurrence in input files on X axis and its suitable for comparison od multiple reports in same time
        
## Example
    * run in command line: "node index.js 'sampleReports/baseline prod.txt' 'sampleReports/baseline.txt' 'sampleReports/baseline2.txt'"
    