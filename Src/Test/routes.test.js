import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import request from 'supertest';

describe('Notification API Routes', () => {
    let app;
    let transporter;


    beforeEach(async () => {

        jest.resetModules();

        jest.unstable_mockModule('../utils/mail.js', () => ({
            default: {
                sendMail: jest.fn().mockResolvedValue({ messageId: 'mock-id' })
            }
        }));

        const appModule = await import('../index.js');
        app = appModule.default;

        const transporterModule = await import('../utils/mail.js');
        transporter = transporterModule.default;
    });

    describe('POST /api/notifications/Usermngmt/new', () => {

        it('devrait envoyer un email de bienvenue et retourner 201 avec des données valides', async () => {
            const userData = {
                userMail: 'test.user@lendema.com',
                userName: 'Test User',
            };

            const response = await request(app)
                .post('/api/notifications/Usermngmt/new')
                .send(userData);

            expect(response.statusCode).toBe(201);
            expect(response.body.message).toContain('Utilisateur créé');
            expect(response.body.user.email).toBe(userData.userMail);

            expect(transporter.sendMail).toHaveBeenCalledTimes(1);

            expect(transporter.sendMail).toHaveBeenCalledWith(expect.objectContaining({
                to: 'test.user@lendema.com',
                subject: 'Bienvenue sur Lendema !',
            }));
        });

        it('devrait retourner une erreur 400 si le userMail est manquant', async () => {
            const userData = { userName: 'Test User' };

            const response = await request(app)
                .post('/api/notifications/Usermngmt/new')
                .send(userData);

            expect(response.statusCode).toBe(400);
            expect(transporter.sendMail).not.toHaveBeenCalled();
        });

        it('devrait retourner une erreur 500 si l\'envoi de l\'email échoue', async () => {

            transporter.sendMail.mockRejectedValue(new Error('SMTP Error'));

            const userData = {
                userMail: 'failure.case@lendema.com',
                userName: 'Failure User',
            };

            const response = await request(app)
                .post('/api/notifications/Usermngmt/new')
                .send(userData);

            expect(response.statusCode).toBe(500);
            expect(response.body.error).toContain('Une erreur interne est survenue');
        });
    });
    describe('POST /api/notifications/VerificationCertificate/request', () => {

        it('devrait envoyer un email de demande et retourner 200', async () => {
            const certData = {
                userMail: 'applicant@lendema.com',
                verificationRole: 'Guide Touristique',
            };

            const response = await request(app)
                .post('/api/notifications/VerificationCertificate/request')
                .send(certData);

            expect(response.statusCode).toBe(200);
            expect(response.body.message).toContain('Email de demande de certification envoyé');
            expect(transporter.sendMail).toHaveBeenCalledTimes(1);
            expect(transporter.sendMail).toHaveBeenCalledWith(expect.objectContaining({
                to: certData.userMail,
                subject: expect.stringContaining('Votre demande de certification a été reçue'),
            }));
        });

        it('devrait retourner une erreur 400 si verificationRole est manquant', async () => {
            const certData = { userMail: 'applicant@lendema.com' };
            const response = await request(app)
                .post('/api/notifications/VerificationCertificate/request')
                .send(certData);

            expect(response.statusCode).toBe(400);
            expect(transporter.sendMail).not.toHaveBeenCalled();
        });
    });

    describe('POST /api/notifications/VerificationCertificate/success', () => {

        it('devrait envoyer un email de succès et retourner 200 avec des données valides', async () => {
            // 1. Préparer les données de test
            const successData = {
                userMail: 'successful.applicant@lendema.com',
                verificationType: 'Huissier de justice',
            };

            // 2. Envoyer la requête à l'API
            const response = await request(app)
                .post('/api/notifications/VerificationCertificate/success')
                .send(successData);

            // 3. Vérifier les résultats
            expect(response.statusCode).toBe(200);
            expect(response.body.message).toContain('Email de succès de certification envoyé');

            // Vérifier que l'email a bien été envoyé
            expect(transporter.sendMail).toHaveBeenCalledTimes(1);

            // Vérifier que l'email a été envoyé avec les bonnes informations
            expect(transporter.sendMail).toHaveBeenCalledWith(expect.objectContaining({
                to: successData.userMail,
                subject: expect.stringContaining('Félicitations, votre certification a été approuvée !'),
            }));
        });

        it('devrait retourner une erreur 400 si verificationType est manquant', async () => {
            // Préparer des données invalides
            const invalidData = {
                userMail: 'incomplete.applicant@lendema.com',
            };

            const response = await request(app)
                .post('/api/notifications/VerificationCertificate/success')
                .send(invalidData);

            // Vérifier la réponse d'erreur
            expect(response.statusCode).toBe(400);
            expect(response.body.error).toContain('sont requis');

            // S'assurer qu'aucun email n'a été envoyé
            expect(transporter.sendMail).not.toHaveBeenCalled();
        });

        it('devrait retourner une erreur 500 si l\'envoi de l\'email échoue', async () => {
            // Simuler un échec de l'envoi d'email pour ce test spécifique
            transporter.sendMail.mockRejectedValue(new Error('Mail server is down'));

            const successData = {
                userMail: 'another.applicant@lendema.com',
                verificationType: 'Donateur',
            };

            const response = await request(app)
                .post('/api/notifications/VerificationCertificate/success')
                .send(successData);

            // Vérifier la réponse d'erreur serveur
            expect(response.statusCode).toBe(500);
            expect(response.body.error).toContain("Impossible d'envoyer l'email de succès de certification");
        });

    });

    describe('POST /api/notifications/VerificationCertificate/failure', () => {

        it('devrait envoyer un email d\'échec et retourner 200 avec des données valides', async () => {
            // 1. Préparer les données de test
            const failureData = {
                userMail: 'rejected.applicant@lendema.com',
                verificationType: 'Partenaire Financier',
            };

            // 2. Envoyer la requête à l'API
            const response = await request(app)
                .post('/api/notifications/VerificationCertificate/failure')
                .send(failureData);

            // 3. Vérifier les résultats
            expect(response.statusCode).toBe(200);
            expect(response.body.message).toContain("Email d'échec de certification envoyé");

            // Vérifier que l'email a bien été envoyé
            expect(transporter.sendMail).toHaveBeenCalledTimes(1);

            // Vérifier que l'email a été envoyé avec les bonnes informations
            expect(transporter.sendMail).toHaveBeenCalledWith(expect.objectContaining({
                to: failureData.userMail,
                subject: expect.stringContaining("votre certification n'a pas été approuvée"),
            }));
        });

        it('devrait retourner une erreur 400 si userMail est manquant', async () => {
            // Préparer des données invalides
            const invalidData = {
                verificationType: 'Partenaire Financier',
            };

            const response = await request(app)
                .post('/api/notifications/VerificationCertificate/failure')
                .send(invalidData);

            // Vérifier la réponse d'erreur
            expect(response.statusCode).toBe(400);
            expect(response.body.error).toContain("sont requis");

            // S'assurer qu'aucun email n'a été envoyé
            expect(transporter.sendMail).not.toHaveBeenCalled();
        });

        it('devrait retourner une erreur 500 si l\'envoi de l\'email échoue', async () => {
            // Simuler un échec de l'envoi d'email pour ce test spécifique
            transporter.sendMail.mockRejectedValue(new Error('SMTP Server Offline'));

            const failureData = {
                userMail: 'another.rejected.applicant@lendema.com',
                verificationType: 'Bailiff',
            };

            const response = await request(app)
                .post('/api/notifications/VerificationCertificate/failure')
                .send(failureData);

            // Vérifier la réponse d'erreur serveur
            expect(response.statusCode).toBe(500);
            expect(response.body.error).toContain("Impossible d'envoyer l'email d'échec de certification");
        });
    });



    describe('POST /api/notifications/Contract/ConfirmationSuccess', () => {

        it('devrait envoyer un email de succès de contrat et retourner 200 avec des données valides', async () => {
            // 1. Préparer les données de test
            const contractData = {
                userMail: 'donor.principal@lendema.com',
                contractId: 'CTR-2025-001',
                role: 'Donateur Principal'
            };

            // 2. Envoyer la requête à l'API
            const response = await request(app)
                .post('/api/notifications/Contract/ConfirmationSuccess')
                .send(contractData);

            // 3. Vérifier les résultats
            expect(response.statusCode).toBe(200);
            expect(response.body.message).toBe("Email de succès du contrat envoyé.");

            // Vérifier que l'email a bien été envoyé
            expect(transporter.sendMail).toHaveBeenCalledTimes(1);

            // Vérifier que l'email a été envoyé avec les bonnes informations
            expect(transporter.sendMail).toHaveBeenCalledWith(expect.objectContaining({
                to: contractData.userMail,
                subject: `Félicitations, le contrat #${contractData.contractId} a été exécuté !`,
            }));
        });

        it('devrait retourner une erreur 400 si le `role` est manquant', async () => {
            // Préparer des données invalides
            const invalidData = {
                userMail: 'donor.principal@lendema.com',
                contractId: 'CTR-2025-001'
                // Le champ 'role' est manquant
            };

            const response = await request(app)
                .post('/api/notifications/Contract/ConfirmationSuccess')
                .send(invalidData);

            // Vérifier la réponse d'erreur
            expect(response.statusCode).toBe(400);
            expect(response.body.error).toContain("sont requis");

            // S'assurer qu'aucun email n'a été envoyé
            expect(transporter.sendMail).not.toHaveBeenCalled();
        });

        it('devrait retourner une erreur 500 si l\'envoi de l\'email échoue', async () => {
            // Simuler un échec de l'envoi d'email pour ce test spécifique
            transporter.sendMail.mockRejectedValue(new Error('Failed to connect to mail server'));

            const contractData = {
                userMail: 'donor.principal@lendema.com',
                contractId: 'CTR-2025-001',
                role: 'Donateur Principal'
            };

            const response = await request(app)
                .post('/api/notifications/Contract/ConfirmationSuccess')
                .send(contractData);

            // Vérifier la réponse d'erreur serveur
            expect(response.statusCode).toBe(500);
            expect(response.body.error).toContain("Impossible d'envoyer l'email de succès du contrat.");
        });

    });


    describe('POST /api/notifications/Contract/ConfirmationFailure', () => {

        it('devrait envoyer un email d\'échec de contrat et retourner 200 avec des données valides', async () => {
            // 1. Préparer les données de test
            const failureData = {
                userMail: 'participant@lendema.com',
                contractId: 'CTR-FAIL-789',
                role: 'Observateur',
                reason: 'Objectif de financement non atteint.'
            };

            // 2. Envoyer la requête à l'API
            const response = await request(app)
                .post('/api/notifications/Contract/ConfirmationFailure')
                .send(failureData);

            // 3. Vérifier les résultats
            expect(response.statusCode).toBe(200);
            expect(response.body.message).toBe("Email d'échec du contrat envoyé.");

            // Vérifier que l'email a bien été envoyé
            expect(transporter.sendMail).toHaveBeenCalledTimes(1);

            // Vérifier que l'email a été envoyé avec les bonnes informations
            expect(transporter.sendMail).toHaveBeenCalledWith(expect.objectContaining({
                to: failureData.userMail,
                subject: `Information importante concernant le contrat #${failureData.contractId}`,
            }));
        });

        it('devrait retourner une erreur 400 si la raison (reason) est manquante', async () => {
            // Préparer des données invalides
            const invalidData = {
                userMail: 'participant@lendema.com',
                contractId: 'CTR-FAIL-789',
                role: 'Observateur'
                // Le champ 'reason' est manquant
            };

            const response = await request(app)
                .post('/api/notifications/Contract/ConfirmationFailure')
                .send(invalidData);

            // Vérifier la réponse d'erreur
            expect(response.statusCode).toBe(400);
            expect(response.body.error).toContain("reason et role sont requis");

            // S'assurer qu'aucun email n'a été envoyé
            expect(transporter.sendMail).not.toHaveBeenCalled();
        });

        it('devrait retourner une erreur 500 si l\'envoi de l\'email échoue', async () => {
            // Simuler un échec de l'envoi d'email pour ce test spécifique
            transporter.sendMail.mockRejectedValue(new Error('Mail server connection refused'));

            const failureData = {
                userMail: 'participant@lendema.com',
                contractId: 'CTR-FAIL-789',
                role: 'Observateur',
                reason: 'Objectif de financement non atteint.'
            };

            const response = await request(app)
                .post('/api/notifications/Contract/ConfirmationFailure')
                .send(failureData);

            // Vérifier la réponse d'erreur serveur
            expect(response.statusCode).toBe(500);
            expect(response.body.error).toContain("Impossible d'envoyer l'email d'échec du contrat.");
        });

    });


    describe('POST /api/notifications/Account/Deletion', () => {

        it('devrait envoyer un email de confirmation de suppression et retourner 200', async () => {
            // 1. Préparer les données de test
            const deletionData = {
                userMail: 'user.to.delete@lendema.com',
            };

            // 2. Envoyer la requête à l'API
            const response = await request(app)
                .post('/api/notifications/Account/Deletion')
                .send(deletionData);

            // 3. Vérifier les résultats
            expect(response.statusCode).toBe(200);
            expect(response.body.message).toBe("Email de suppression de compte envoyé.");

            // Vérifier que l'email a bien été envoyé
            expect(transporter.sendMail).toHaveBeenCalledTimes(1);

            // Vérifier que l'email a été envoyé avec les bonnes informations
            expect(transporter.sendMail).toHaveBeenCalledWith(expect.objectContaining({
                to: deletionData.userMail,
                subject: 'Confirmation de suppression de votre compte Lendema',
            }));
        });

        it('devrait retourner une erreur 400 si userMail est manquant', async () => {
            // Envoyer une requête avec un corps vide
            const response = await request(app)
                .post('/api/notifications/Account/Deletion')
                .send({});

            // Vérifier la réponse d'erreur
            expect(response.statusCode).toBe(400);
            expect(response.body.error).toContain("Le champ userMail est requis.");

            // S'assurer qu'aucun email n'a été envoyé
            expect(transporter.sendMail).not.toHaveBeenCalled();
        });

        it('devrait retourner une erreur 500 si l\'envoi de l\'email échoue', async () => {
            // Simuler un échec de l'envoi d'email pour ce test
            transporter.sendMail.mockRejectedValue(new Error('Authentication failed'));

            const deletionData = {
                userMail: 'user.to.delete@lendema.com',
            };

            const response = await request(app)
                .post('/api/notifications/Account/Deletion')
                .send(deletionData);

            // Vérifier la réponse d'erreur serveur
            expect(response.statusCode).toBe(500);
            expect(response.body.error).toContain("Impossible d'envoyer l'email de suppression de compte.");
        });

    });

    describe('POST /api/notifications/Account/verification', () => {

        it('devrait envoyer un email de vérification et retourner 200', async () => {
            // 1. Préparer les données de test
            const verificationData = {
                userMail: 'new.user.verify@lendema.com',
                link: 'https://lendema.site/verify?token=12345abcdef'
            };

            // 2. Envoyer la requête à l'API
            const response = await request(app)
                .post('/api/notifications/Account/verification')
                .send(verificationData);

            // 3. Vérifier les résultats
            expect(response.statusCode).toBe(200);
            expect(response.body.message).toBe("Email de verification de compte envoyé.");

            // Vérifier que l'email a bien été envoyé
            expect(transporter.sendMail).toHaveBeenCalledTimes(1);

            // Vérifier que l'email a été envoyé avec les bonnes informations
            expect(transporter.sendMail).toHaveBeenCalledWith(expect.objectContaining({
                to: verificationData.userMail,
                subject: expect.stringContaining("poursuivre votre tentative de creation de compte"),
                html: expect.stringContaining(verificationData.link) // S'assurer que le lien est dans le corps de l'email
            }));
        });

        it('devrait retourner une erreur 400 si le lien (link) est manquant', async () => {
            // Préparer des données invalides
            const invalidData = {
                userMail: 'new.user.verify@lendema.com'
                // Le champ 'link' est manquant
            };

            const response = await request(app)
                .post('/api/notifications/Account/verification')
                .send(invalidData);

            // Vérifier la réponse d'erreur
            expect(response.statusCode).toBe(400);
            expect(response.body.error).toContain("link est/sont requis");

            // S'assurer qu'aucun email n'a été envoyé
            expect(transporter.sendMail).not.toHaveBeenCalled();
        });

        it('devrait retourner une erreur 500 si l\'envoi de l\'email échoue', async () => {
            // Simuler un échec de l'envoi d'email pour ce test
            transporter.sendMail.mockRejectedValue(new Error('Invalid credentials'));

            const verificationData = {
                userMail: 'new.user.verify@lendema.com',
                link: 'https://lendema.site/verify?token=12345abcdef'
            };

            const response = await request(app)
                .post('/api/notifications/Account/verification')
                .send(verificationData);

            // Vérifier la réponse d'erreur serveur
            expect(response.statusCode).toBe(500);
            expect(response.body.error).toContain("Impossible d'envoyer l'email de verification de compte.");
        });

    });


    describe('POST /api/notifications/Account/Debit', () => {
        it('devrait envoyer un email de confirmation de débit et retourner 200', async () => {
            const debitData = {
                userMail: "donor@lendema.com",
                amount: 5000,
                currency: "XAF",
                contractId: "CTR-12345"
            };
            const response = await request(app)
                .post('/api/notifications/Account/Debit')
                .send(debitData);

            expect(response.statusCode).toBe(200);
            expect(transporter.sendMail).toHaveBeenCalledTimes(1);
            expect(transporter.sendMail).toHaveBeenCalledWith(expect.objectContaining({
                to: debitData.userMail,
                subject: `Confirmation de votre don de ${debitData.amount} ${debitData.currency}`
            }));
        });
    });
});
