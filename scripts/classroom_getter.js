const fs = require("fs").promises;
const path = require("path");
const process = require("process");
const { authenticate } = require("@google-cloud/local-auth");
const { google } = require("googleapis");
const { json } = require("body-parser");

// If modifying these scopes, delete token.json.
const SCOPES = [
  "https://www.googleapis.com/auth/classroom.courses.readonly",
  "https://www.googleapis.com/auth/classroom.coursework.me.readonly",
];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.

const credsFolder = './credentials/'
const TOKEN_PATH = path.join(process.cwd(), credsFolder+"token.json");
const CREDENTIALS_PATH = path.join(process.cwd(), credsFolder+"credentials.json");

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: "authorized_user",
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });


  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

/**
 * Lists the first 10 courses the user has access to.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function listCourses(auth) {
  const classroom = google.classroom({ version: "v1", auth });
  const res = await classroom.courses.list({
    pageSize: 10,
  });

  const courses = res.data.courses;
  if (!courses || courses.length === 0) {
    console.log("No courses found.");
    return;
  }
  console.log("Courses:");
  let courseData = [];
  // Iterate through course
  courses.forEach((course) => {
    // Print course name and course id
    console.log(`${course.name} (${course.id})`);
    // Get courseWorks of each course
    const courseWorks = classroom.courses.courseWork.list({
      courseId: course.id,
    });
    courseWorks.then((result) => {

      courseData.push(result.data);

    });

    fs.writeFile('gclassroom_courseworks_data.json', JSON.stringify(courseData));

  });
}

authorize().then(listCourses).catch(console.error);
