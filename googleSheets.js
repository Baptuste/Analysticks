const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const readline = require('readline');

// Charge le fichier JSON de l'authentification OAuth 2.0
const credentials = require(path.join(__dirname, 'client_secret.json')); // Assure-toi que le fichier JSON est dans le bon chemin

// Scopes nécessaires pour accéder à Google Sheets
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

// Créer un client OAuth2 avec les informations d'authentification
const oauth2Client = new google.auth.OAuth2(
  credentials.web.client_id,
  credentials.web.client_secret,
  credentials.web.redirect_uris[0]
);

// Fonction pour obtenir un jeton d'accès
const getAccessToken = async () => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  console.log('Authorize this app by visiting this url:', authUrl);

  // Demander à l'utilisateur d'entrer le code d'autorisation
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Enter the code from that page here: ', async (code) => {
    rl.close();

    // Échanger le code d'autorisation contre un jeton d'accès
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    console.log('Tokens acquired.');
    // Appeler la fonction pour récupérer les données de la feuille après l'authentification
    getSheetsData('1aKlF_-dyPd40Mcj492OLfkPDHCYHS8KsafS1zABgky4', 'Données!A1:D10'); // Remplace les valeurs selon tes besoins
  });
};

// Fonction pour récupérer des données depuis Google Sheets
const getSheetsData = async (spreadsheetId, range) => {
  const sheets = google.sheets({ version: 'v4', auth: oauth2Client });

  // Utilisation de l'API Sheets pour obtenir des données
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  console.log('Data from sheet:', response.data.values);
};

// Commencer l'authentification
getAccessToken();
