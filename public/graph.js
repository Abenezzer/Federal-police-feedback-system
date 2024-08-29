// Select DOM elements
const selectedSystem = document.querySelector("#select-system");
const totalFeedbackElement = document.querySelector("#total-feedback");
const chartContainer = document.getElementById("columnchart_material");
const questionPlace = document.getElementById("questions");

// Handle system selection change
selectedSystem.addEventListener("change", async (e) => {
  const selectedValue = e.target.value;

  if (selectedValue !== "Filter overview by department") {
    // Show loading state
    chartContainer.innerHTML = "<p>Loading...</p>";

    try {
      // Fetch data for the selected product
      const response = await fetch(`/admin/product-responses/${selectedValue}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      // Log the fetched data for debugging
      console.log(data);

      // Check if totalFeedbacks is present
      if (data.totalFeedbacks !== undefined) {
        // Update the total feedback count element
        totalFeedbackElement.textContent = `Total Feedback: ${data.totalFeedbacks}`;
      } else {
        console.warn("totalFeedbacks is undefined.");
      }

      // Draw the chart with the fetched data
      drawChart(data);
      //   insert questions
      const htmlString = `
    <div class="mb-5">
    <h4 class="display-6 text-center my-4">Questions</h4>
    <ol class="list-group list-group-numbered gap-3">
      ${data.aggregatedResults
        .map((q) => {
          return `<li class="list-group-item fs-5"> ${q.question}</li>`;
        })
        .join("")}
    </ol>
    </div>

  `;
      questionPlace.innerHTML = htmlString;
    } catch (error) {
      console.error("Error fetching product responses:", error);
      chartContainer.innerHTML = "<p>Error loading data.</p>";
    }
  }
});

function drawChart(data) {
  // Check if Google Charts is available
  if (!google.visualization || !google.visualization.arrayToDataTable) {
    console.error("Google Charts library not loaded properly.");
    chartContainer.innerHTML = "<p>Unable to load chart.</p>";
    return;
  }

  // Prepare the data array for Google Charts with labels
  const chartData = [["Question", "Poor", "Average", "Good", "Very Good"]];

  // Assuming each result corresponds to a specific question
  const questionLabels = [
    "Question 1",
    "Question 2",
    "Question 3",
    "Question 4",
  ];

  data.aggregatedResults.forEach((result, index) => {
    chartData.push([
      questionLabels[index], // Label for each question
      result.responses.poor,
      result.responses.average,
      result.responses.good,
      result.responses["very-good"],
    ]);
  });

  // Convert to DataTable for Google Charts
  const dataTable = google.visualization.arrayToDataTable(chartData);

  // Define chart options
  const options = {
    chart: {
      title: "Product Feedback",
      subtitle: "User feedback",
    },
  };

  // Draw the chart
  const chart = new google.charts.Bar(chartContainer);
  chart.draw(dataTable, google.charts.Bar.convertOptions(options));
}

// Ensure Google Charts is loaded before drawing the chart
google.charts.load("current", { packages: ["bar"] });
