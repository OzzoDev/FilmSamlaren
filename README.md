# FilmSamlaren
Examination-project for a Javascript based frontend course

## Set up
To start up the project clone the repo by accessing the url of the repo then run 
```git pull origin main```
in your terminal. To open the project in a browser right click on **index.html** and _open with live server_ if your are using vscode as your code editor.

## Usage
This app is movie discovering app called **Film Nest** that make it easy to find your next movie to watch. 
The start pages shows all the available movies with filtering options helping the user discovering moives.
There is also a button with the text of _Movie Night Suprise_ that generates random movies using ai.
To view more details about a movie click on it to be redirected to a movie detials page where you can watch the movie trailer and more.
The app also support a watchlist where the user can save movies to watch for later.
An addiontally feature also available is a movie quiz page where the user can get custom tailored movies suggestions powered by the claude ai api. 
All these pages can be accessed by the navigation bar in the top of each page. 
To return to the start page click on the **Film Nest** logo.

## Figma wireframe
https://www.figma.com/design/NkJiYIFtJBrE8MU98ayHzS/Untitled?node-id=0-1&p=f&t=ZqOiqJ5zkn6ldEJ1-0

## API
This project uses the TMDB API with the Claude AI API to generate custom-tailored movie suggestions. Both APIs require an API key, which can be acquired from the API documentation.
Claude is used exclusively with POST requests to get movie suggestions based on a query.
Here are three endpoints used to make GET requests to the TMDB API:

***https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_KEY}&language=en-US*** - fetch genres
***https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_KEY}&with_genres=${genreId}*** - fetch movies by genre id
***https://api.themoviedb.org/3/movie/${id}/videos?api_key=${TMDB_KEY}*** - fetch movie trailer by movie id


### JSON, HTTP/HTTPS, asynchronous requirements
JSON data is centreal in this app as all the api calls returns data in json format that is later used to render the retuned data.
All api calls is using HTTP/HTTPS to request the data.
Async and await is used accoss the whole app to handle api calls and be able to use the data

### UX/UI Requirements

#### User-Centric Design
The app focuses on what the end user needs to effectively use the application. This includes intuitive navigation, efficient filtering options, and logic for storing movies. By understanding user behaviors and preferences, the design ensures that users can easily find and manage their movie selections. Conducting user research and usability testing helps refine these features to meet user expectations.

#### Consistency
A universal color scheme is employed to maintain high consistency across the app. This not only enhances the aesthetic appeal but also aids in user recognition and navigation. For example, using a standardized movie card class ensures that all movie cards have a uniform appearance, making it easier for users to scan and compare options. Additionally, the header and footer are consistent on all pages, providing a cohesive experience and reinforcing brand identity.

#### Hierarchy and Clarity
Hierarchy and clarity are prioritized by emphasizing important elements using larger font sizes and brighter colors to capture the user's attention. By placing these critical elements in a logical flow throughout the page, users can quickly identify key information and actions. Visual hierarchy guides users naturally through the content, reducing confusion and enhancing their overall experience.

#### Feedback
Clear and helpful feedback messages are implemented to inform users about ongoing processes. For instance, users receive concise and user-friendly notifications in case of errors, ensuring they understand what went wrong. When searching for movies, a message appears indicating how many results were found, providing reassurance that the search was effective. This immediate feedback helps users feel in control and informed about their actions.

#### Accessibility
All pages undergo testing through Google Chrome's Lighthouse dev tools, achieving a 100% accessibility score. This is accomplished by utilizing semantic HTML, ensuring screen readers can interpret the content correctly. High-contrast colors improve readability, and alt and title attributes are set for image elements to assist users relying on assistive technologies. This commitment to accessibility ensures that a diverse range of users can enjoy and navigate the app effectively.

#### Simplicity
Simplicity is a fundamental principle as the app focuses on rendering only necessary elements and sections. This enhances the user experience by keeping the interface clean and straightforward, allowing users to easily understand the available features. By minimizing clutter, the app operates seamlessly and effortlessly, ensuring an optimized user experience that encourages engagement and satisfaction.

#### Summary
These principles collectively enhance the app's usability and user satisfaction, creating a more effective and enjoyable experience. By emphasizing user needs, maintaining consistency, ensuring clarity, providing feedback, prioritizing accessibility, and embracing simplicity, the app is designed to meet the expectations of its users.
