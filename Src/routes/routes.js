import transporter from "../utils/mail.js";

// const generator = require('../utils/MessageGenerator');
import generator from "../utils/MessageGenerator.js";
// const router = require('express').Router();
import express from 'express';

const router = express.Router();

// --- Routes pour la gestion des utilisateurs ---
router.post('/Usermngmt/new', async (req, res) => {
    try {
        const { userMail, userName } = req.body;
        if (!userMail || !userName) {
            return res.status(400).json({ error: "Les champs userMail et userName sont requis." });
        }

        const emailContent = generator.accountCreation(userName);

        const mailOptions = {
            from: `"Lendema" <${process.env.MAIL_USER}>`,
            to: userMail,
            subject: emailContent.subject,
            text: emailContent.text,
            html: emailContent.html
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email de bienvenue envoyé`);

        res.status(201).json({
            message: "Utilisateur créé et email de bienvenue envoyé avec succès.",
            user: { name: userName, email: userMail }
        });

    } catch(err) {
        console.error("Erreur sur la route /Usermngmt/new:", err);
        res.status(500).json({ error: "Une erreur interne est survenue." });
    }
});

// --- Routes pour la Certification ---
router.post('/VerificationCertificate/request', async (req, res) => {
    try {
        const { userMail, verificationRole } = req.body;
        if (!userMail || !verificationRole) {
            return res.status(400).json({ error: "Les champs userMail et verificationRole sont requis." });
        }

        const emailContent = generator.verificationRequest(userMail, verificationRole);

        const mailOptions = { from: `"Lendema" <${process.env.MAIL_USER}>`, to: userMail, ...emailContent };
        await transporter.sendMail(mailOptions);


        res.status(200).json({ message: "Email de demande de certification envoyé." });

    } catch (e) {
        console.error("Erreur sur /VerificationCertificate/request:", e);
        res.status(500).json({ error: "Impossible d'envoyer l'email de demande de certification." });
    }
});

router.post('/VerificationCertificate/success', async (req, res) => {
    try {
        const { userMail, verificationType } = req.body;
        if (!userMail || !verificationType) {
            return res.status(400).json({ error: "Les champs userMail et verificationType sont requis." });
        }

        const emailContent = generator.verificationSuccess(userMail, verificationType);

        const mailOptions = { from: `"Lendema" <${process.env.MAIL_USER}>`, to: userMail, ...emailContent };
        await transporter.sendMail(mailOptions);


        res.status(200).json({ message: "Email de succès de certification envoyé." });

    } catch (err) {
        console.error("Erreur sur /VerificationCertificate/success:", err);
        res.status(500).json({ error: "Impossible d'envoyer l'email de succès de certification." });
    }
});


router.post('/VerificationCertificate/failure', async (req, res) => {
    try {
        const { userMail, verificationType } = req.body;
        if (!userMail || !verificationType) {
            return res.status(400).json({ error: "Les champs userMail et verificationType sont requis." });
        }

        const emailContent = generator.verificationFailure(userMail, verificationType);

        const mailOptions = { from: `"Lendema" <${process.env.MAIL_USER}>`, to: userMail, ...emailContent };
        await transporter.sendMail(mailOptions);


        res.status(200).json({ message: "Email d'échec de certification envoyé." });

    } catch (err) {
        console.error("Erreur sur /VerificationCertificate/failure:", err);
        res.status(500).json({ error: "Impossible d'envoyer l'email d'échec de certification." });
    }
});

// --- Routes pour les Contrats et autres notifications ---
router.post('/Contract/ConfirmationSuccess', async (req, res) => {
    try {
        const { userMail, contractId, role } = req.body;
        if (!userMail || !contractId || !role) {
            return res.status(400).json({ error: "userMail, contractId et role sont requis." });
        }

        const emailContent = generator.contractExecutionSuccess(userMail, contractId, role);
        const mailOptions = { from: `"Lendema" <${process.env.MAIL_USER}>`, to: userMail, ...emailContent };
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "Email de succès du contrat envoyé." });

    } catch (err) {
        console.error("Erreur sur /Contract/ConfirmationSuccess:", err);
        res.status(500).json({ error: "Impossible d'envoyer l'email de succès du contrat." });
    }
});

router.post('/Contract/ConfirmationFailure', async (req, res) => {
    try {
        const { userMail, contractId, reason, role } = req.body;
        if (!userMail || !contractId || !reason || !role) {
            return res.status(400).json({ error: "userMail, contractId, reason et role sont requis." });
        }

        const emailContent = generator.contractFailure(userMail, contractId, reason);
        const mailOptions = { from: `"Lendema" <${process.env.MAIL_USER}>`, to: userMail, ...emailContent };
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "Email d'échec du contrat envoyé." });

    } catch (err) {
        console.error("Erreur sur /Contract/ConfirmationFailure:", err);
        res.status(500).json({ error: "Impossible d'envoyer l'email d'échec du contrat." });
    }
});

router.post('/Account/Debit', async (req, res) => {
    try {
        const { userMail, amount, currency, contractId } = req.body;
        if (!userMail || !amount || !currency || !contractId) {
            return res.status(400).json({ error: "userMail, amount, currency et contractId sont requis." });
        }

        const emailContent = generator.accountDebit(userMail, amount, currency, contractId);
        const mailOptions = { from: `"Lendema" <${process.env.MAIL_USER}>`, to: userMail, ...emailContent };
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "Email de débit du compte envoyé." });

    } catch (err) {
        console.error("Erreur sur /Account/Debit:", err);
        res.status(500).json({ error: "Impossible d'envoyer l'email de débit du compte." });
    }
});

router.post('/Account/Deletion', async (req, res) => {
    try {
        const { userMail } = req.body;
        if (!userMail) {
            return res.status(400).json({ error: "Le champ userMail est requis." });
        }

        const emailContent = generator.accountDeletion(userMail);
        const mailOptions = { from: `"Lendema" <${process.env.MAIL_USER}>`, to: userMail, ...emailContent };
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "Email de suppression de compte envoyé." });

    } catch (err) {
        console.error("Erreur sur /Account/Deletion:", err);
        res.status(500).json({ error: "Impossible d'envoyer l'email de suppression de compte." });
    }
});

router.post('/Account/verification', async (req, res) => {
    try {

        const { userMail, link } = req.body;
        if (!userMail || !link) {
            return res.status(400).json({ error: "Le champ userMail et/ou le champ link est/sont requis." });
        }

        const emailContent = generator.AuthEmailVerification(userMail, link);
        const mailOptions = { from: `"Lendema" <${process.env.MAIL_USER}>`, to: userMail, ...emailContent };
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "Email de verification de compte envoyé." });

    } catch (err) {

        console.error("Erreur sur /Account/verification:", err);
        res.status(500).json({ error: "Impossible d'envoyer l'email de verification de compte." });
    }
});
export default router;