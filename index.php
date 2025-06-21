<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard of Austria’s Higher Education Landscape</title>
    <!-- Leaflet CSS -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
    <!-- Link to external CSS file containing all styles -->
    <link rel="stylesheet" href="style.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
</head>
<body>
    <div id="app">
        <!-- Header Section -->
        <header>
            <div class="container-header">
                <div id="heading"><h1>Dashboard of Austria’s Higher Education Landscape</h1></div>
            </div>
        </header>

        <!-- Main Content Area -->
        <main>
            <!-- Left Sidebar -->
            <aside id="controls" class="left-sidebar">
			<h2>Filters</h2>
			<label>
                    1. Select level of study
					<span class="info-tooltip" title="Bachelor, Master, Doctorate or other programme levels.">ⓘ</span><br />
                    <select id="filter-type"><option value="">All</option></select>
                </label><br /><br />
				<label>
                    2. Pick higher-level field of study
					<span class="info-tooltip" title="Academic discipline based on the ISCED‑F classification (Fields of Education and Training).">ⓘ</span><br />
                    <select id="filter-category"><option value="">All</option></select>
                </label><br />
				<br />
				<label>
                    3. Set preferred language
					<span class="info-tooltip" title="Language in which the programme is offered.">ⓘ</span><br />
                    <select id="filter-language"><option value="">All</option></select>
                </label><br /><br />
                <label>
                    4. Choose city of interest
					<span class="info-tooltip" title="City where the institution is located.">ⓘ</span><br />
                    <select id="filter-location"><option value="">All</option></select>
                </label><br />
                <br />
				<a href="index.php" >Clear filtering</a><br />
                <br />
                <a href="imprint.php" target="_blank">Imprint</a><br />
				<br />
				<br />
				<strong>Version:</strong> 1<br />
				<strong>Last updated:</strong> June 20, 2025<br />
				
				
            </aside>

            <!-- Central Main Content -->
            <section class="main-content">
  <div class="main-section-top">
    <div id="map"></div>
  </div>
  <div class="main-section-bottom">
    This dashboard provides a comprehensive overview of Austria’s higher-education landscape, showcasing all courses offered by public and private universities, as well as universities of applied sciences. While our primary audience is high-school students exploring their undergraduate options, graduate students will also find Master’s and PhD offerings. Use the filters to refine the list according to your interests.
  </div>
</section>

            <!-- Right Sidebar -->
            <aside class="right-sidebar">
                <!-- Top Right Section -->
                <div class="right-section-top">
                    <h2>List of Courses</h2>
                </div>

                <!-- Bottom Right Section -->
                <div class="right-section-bottom">
                    <div id="list"></div>
                </div>
            </aside>
        </main>

        <!-- Footer Section -->
        <footer>
            <div class="container-footer">
                <!-- Footer content goes here -->
            </div>
        </footer>
    </div>

    <!-- Leaflet JS -->
    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <!-- Your application logic -->
    <script src="app.js"></script>
</body>
</html