// CORRECTION : Ajout des fonctions d'injection de charge (rampUsers, etc.) à l'importation
import { simulation, scenario, exec, pause, csv, rampUsers, atOnceUsers, constantUsersPerSec, nothingFor } from '@gatling.io/core';
import { http, status, StringBody } from '@gatling.io/http';

// --- 1. Configuration du Protocole HTTP ---
const httpProtocol = http
  .baseUrl('http://localhost:4500/api/notifications')
  .header('Content-Type', 'application/json')
  .acceptHeader('application/json');

// --- 2. Définition du Feeder ---
const testDataFeeder = csv('test_data.csv').random();

// --- 3. Définition des Scénarios ---
const createAccountScenario = scenario("Création d'un Nouvel Utilisateur")
  .feed(testDataFeeder)
  .exec(
    http("POST /Usermngmt/new")
      .post('/Usermngmt/new')
      .body(StringBody('{"userMail": "${userMail}", "userName": "${userName}"}'))
      .asJson()
      .check(status().is(201))
  );

const certRequestScenario = scenario('Demande de Certification')
  .feed(testDataFeeder)
  .exec(
    http("POST /VerificationCertificate/request")
      .post('/VerificationCertificate/request')
      .body(StringBody('{"userMail": "${userMail}", "verificationRole": "${role}"}'))
      .asJson()
      .check(status().is(200))
  );

const contractSuccessScenario = scenario('Succès de Contrat')
  .feed(testDataFeeder)
  .exec(
    http("POST /Contract/ConfirmationSuccess")
      .post('/Contract/ConfirmationSuccess')
      .body(StringBody('{"userMail": "${userMail}", "contractId": "${contractId}", "role": "${role}"}'))
      .asJson()
      .check(status().is(200))
  );
  
const accountVerificationScenario = scenario('Vérification de Compte par Email')
  .feed(testDataFeeder)
  .exec(
    http("POST /Account/verification")
      .post('/Account/verification')
      .body(StringBody('{"userMail": "${userMail}", "link": "https://lendema.site/verify?token=${token}"}'))
      .asJson()
      .check(status().is(200))
  );


export default simulation((setUp) => {
  // Le bloc setUp définit l'injection de la charge
  setUp(
    createAccountScenario.injectOpen(rampUsers(10).during(10)), // Correct syntax
    certRequestScenario.injectOpen(atOnceUsers(5)),
    contractSuccessScenario.injectOpen(constantUsersPerSec(2).during(15)), // Correct syntax
    accountVerificationScenario.injectOpen(nothingFor(5), atOnceUsers(20))
  ).protocols(httpProtocol);
});