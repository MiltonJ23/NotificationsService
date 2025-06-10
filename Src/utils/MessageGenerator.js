/**
 * Génère le contenu HTML complet d'un email en utilisant un modèle de base.
 * @param {string} title - Le titre qui apparaîtra dans l'en-tête de l'email.
 * @param {string} body - Le contenu principal du message (peut contenir du HTML).
 * @returns {string} - Le code HTML complet de l'email.
 */
function generateHtmlTemplate(title, body) {
    // CORRIGÉ : Le nom de la marque dans le footer a été mis à jour.
    return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f7; }
            .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
            .header { background-color: #4A90E2; color: #ffffff; padding: 20px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { padding: 30px; line-height: 1.6; color: #333333; }
            .footer { background-color: #f4f4f7; text-align: center; padding: 15px; font-size: 12px; color: #888888; }
            .button { display: inline-block; padding: 12px 25px; margin-top: 20px; background-color: #4A90E2; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>${title}</h1>
            </div>
            <div class="content">
                ${body}
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Lendema. Tous droits réservés.</p>
            </div>
        </div>
    </body>
    </html>
    `;
}

const messageGenerator = {

    /**
     * Génère le contenu de l'email de bienvenue pour la création de compte.
     * @param {string} username - Le nom d'utilisateur du nouveau membre.
     * @returns {{subject: string, text: string, html: string}}
     */
    accountCreation: (username) => {
        const subject = "Bienvenue sur Lendema !";
        const text = `Bonjour ${username},\n\nBienvenue sur Lendema ! Nous sommes ravis de vous compter parmi nous. Préparez-vous à explorer, consulter et venir en aide aux organes sociaux camerounais comme jamais auparavant.\n\nL'équipe Lendema`;
        const htmlBody = `
            <p>Bonjour <strong>${username}</strong>,</p>
            <p>Bienvenue sur Lendema ! Nous sommes ravis de vous compter parmi nous.</p>
            <p>Préparez-vous à explorer, consulter et venir en aide aux organes sociaux camerounais comme jamais auparavant.</p>
            <a href="https://lendema.site/login" class="button">Commencer</a>
        `;
        return { subject, text, html: generateHtmlTemplate("Bienvenue !", htmlBody) };
    },

    /**
     * Génère le contenu de l'email pour une demande de certification.
     * @param {string} username - Le nom d'utilisateur.
     * @param {string} verificationType - Le type de certification demandée.
     * @returns {{subject: string, text: string, html: string}}
     */
    verificationRequest: (username, verificationType) => {
        const subject = "Votre demande de certification a été reçue";
        const text = `Bonjour ${username},\n\nNous avons bien reçu votre demande de certification en tant que "${verificationType}". Notre équipe va l'examiner et vous recevrez une notification une fois le processus terminé.\n\nL'équipe Lendema`;
        const htmlBody = `
            <p>Bonjour <strong>${username}</strong>,</p>
            <p>Nous avons bien reçu votre demande de certification en tant que <strong>"${verificationType}"</strong>.</p>
            <p>Notre équipe va l'examiner et vous recevrez une notification une fois le processus terminé. Merci de votre patience.</p>
        `;
        return { subject, text, html: generateHtmlTemplate("Demande de certification reçue", htmlBody) };
    },

    /**
     * Génère le contenu de l'email pour une certification réussie.
     * @param {string} username - Le nom d'utilisateur.
     * @param {string} verificationType - Le type de certification obtenue.
     * @returns {{subject: string, text: string, html: string}}
     */
    verificationSuccess: (username, verificationType) => {
        const subject = "Félicitations, votre certification a été approuvée !";
        const text = `Bonjour ${username},\n\nFélicitations ! Votre demande de certification en tant que "${verificationType}" a été approuvée. Votre profil affichera désormais votre statut de certification.\n\nL'équipe Lendema`;
        const htmlBody = `
            <p>Bonjour <strong>${username}</strong>,</p>
            <p><strong>Félicitations !</strong> Votre demande de certification en tant que <strong>"${verificationType}"</strong> a été approuvée.</p>
            <p>Votre profil affichera désormais votre statut de certification, vous donnant plus de visibilité et de crédibilité au sein de notre communauté.</p>
            <a href="https://lendema.site/profil" class="button">Voir mon profil</a>
        `;
        return { subject, text, html: generateHtmlTemplate("Demande de Certification approuvée !", htmlBody) };
    },

    /**
     * Génère le contenu de l'email pour une certification réussie.
     * @param {string} username - Le nom d'utilisateur.
     * @param {string} verificationType - Le type de certification obtenue.
     * @returns {{subject: string, text: string, html: string}}
     */
    verificationFailure: (username, verificationType) => {
        const subject = "Nous regrettons, mais malheureusement votre certification n'a pas été approuvée !";
        const text = `Bonjour ${username},\n\n Votre demande de certification en tant que "${verificationType}" n'a pas été approuvée. Vous ne pouvez toujours pas effectuer de contrat mais vous pouvez retenter une requete de certification.\n\nL'équipe Lendema`;
        const htmlBody = `
            <p>Bonjour <strong>${username}</strong>,</p>
            <p><strong>Malheureusement </strong> Votre demande de certification en tant que <strong>"${verificationType}"</strong> n'a  pas été approuvée.</p>
            <p>Vous ne pouvez toujours pas effectuer de contrat mais vous pouvez retenter une requete de certification</p>
            <a href="https://lendema.site/profil" class="button">Voir mon profil</a>
        `;
        return { subject, text, html: generateHtmlTemplate("Demande de Certification rejetee !", htmlBody) };
    },


    /**
     * Génère le contenu de l'email pour une validation par email
     * @param {string} username - Le nom d'utilisateur.
     * @param {string} mail - Le lien de verification.
     * @returns {{subject: string, text: string, html: string}}
     */
    AuthEmailVerification: (username, mail) => {
        const subject = "Veuillez poursuivre votre tentative de creation de compte en cliquant le lien ci-dessous !";
        const text = `Bonjour ${username},\n\n Continuez le processus de creation de compte en cliquant sur cet email.\n "${mail}".\n\nL'équipe Lendema`;
        const htmlBody = `
            <p>Bonjour <strong>${username}</strong>,</p>
            <p><strong>Continuez </strong> votre demande processus d'inscription sur lendema en cliquant le lien ci-dessous</p>
            
            <a href="${mail}" class="button">verifier mon compte</a>
        `;
        return { subject, text, html: generateHtmlTemplate("Demande de verification de compte !", htmlBody) };
    },

    /**
     * Génère le contenu de l'email pour une exécution de contrat réussie.
     * @param {string} username - Le nom d'utilisateur.
     * @param {string} contractId - L'ID du contrat.
     * @param {string} role - Le rôle de l'utilisateur dans le contrat.
     * @returns {{subject: string, text: string, html: string}}
     */
    contractExecutionSuccess: (username, contractId, role) => {
        const subject = `Félicitations, le contrat #${contractId} a été exécuté !`;
        const text = `Bonjour ${username},\n\nFélicitations ! Votre action en tant que "${role}" a été décisive pour l'exécution du contrat #${contractId}. Nous vous remercions de soutenir les enfants défavorisés du Cameroun.\n\nL'équipe Lendema`;
        const htmlBody = `
            <p>Bonjour <strong>${username}</strong>,</p>
            <p><strong>Félicitations !</strong> Votre action en tant que <strong>"${role}"</strong> a été décisive et a participé à l'exécution avec succès du contrat <strong>"${contractId}"</strong>.</p>
            <p>Vous pouvez consulter, et télécharger le rapport de votre contrat, et l'utiliser comme bon vous semblera devant les autorités compétentes.</p>
            <a href="https://lendema.site/smarts-contracts" class="button">Consulter le smart contract</a>
        `;
        return { subject, text, html: generateHtmlTemplate("Contrat Exécuté avec Succès !", htmlBody) };
    },



    /**
     * AJOUTÉ : Génère le contenu de l'email pour un débit de compte (donation).
     * @param {string} username - Le nom d'utilisateur.
     * @param {number|string} amount - Le montant débité.
     * @param {string} currency - La devise (ex: "XAF", "EUR").
     * @param {string} contractId - L'ID du contrat financé.
     * @returns {{subject: string, text: string, html: string}}
     */
    accountDebit: (username, amount, currency, contractId) => {
        const subject = `Confirmation de votre don de ${amount} ${currency}`;
        const text = `Bonjour ${username},\n\nNous confirmons la réception de votre don de ${amount} ${currency} pour soutenir le contrat #${contractId}. Votre contribution fait une réelle différence. Merci !\n\nL'équipe Lendema`;
        const htmlBody = `
            <p>Bonjour <strong>${username}</strong>,</p>
            <p>Nous vous remercions chaleureusement pour votre générosité. Nous confirmons la réception de votre don de :</p>
            <h2 style="text-align: center; color: #4A90E2;">${amount} ${currency}</h2>
            <p>Ces fonds ont été alloués au contrat <strong>#${contractId}</strong>. Votre contribution est essentielle pour la réussite de nos initiatives sociales.</p>
            <a href="https://lendema.site/smarts-contracts/${contractId}" class="button">Voir le contrat</a>
        `;
        return { subject, text, html: generateHtmlTemplate("Merci pour votre don !", htmlBody) };
    },

    /**
     * AJOUTÉ : Génère le contenu de l'email pour un échec de contrat.
     * @param {string} username - Le nom d'utilisateur.
     * @param {string} contractId - L'ID du contrat.
     * @param {string} reason - La raison de l'échec.
     * @returns {{subject: string, text: string, html: string}}
     */
    contractFailure: (username, contractId, reason) => {
        const subject = `Information importante concernant le contrat #${contractId}`;
        const text = `Bonjour ${username},\n\nNous vous informons que l'exécution du contrat #${contractId} n'a malheureusement pas pu aboutir. Raison : ${reason}.\nLes fonds qui avaient été alloués à ce projet vous seront retournés. Pour toute question, n'hésitez pas à nous contacter.\n\nL'équipe Lendema`;
        const htmlBody = `
            <p>Bonjour <strong>${username}</strong>,</p>
            <p>Nous vous informons que l'exécution du contrat <strong>#${contractId}</strong> n'a malheureusement pas pu aboutir.</p>
            <p><strong>Raison de l'échec :</strong> ${reason}</p>
            <p>Conformément à nos engagements, tous les fonds que vous aviez alloués à ce projet vous seront retournés. Nous vous remercions de votre confiance et espérons pouvoir compter sur votre soutien pour de futures initiatives.</p>
        `;
        return { subject, text, html: generateHtmlTemplate("Mise à jour du contrat", htmlBody) };
    },

    /**
     * AJOUTÉ : Génère le contenu de l'email de confirmation de suppression de compte.
     * @param {string} username - Le nom d'utilisateur.
     * @returns {{subject: string, text: string, html: string}}
     */
    accountDeletion: (username) => {
        const subject = "Confirmation de suppression de votre compte Lendema";
        const text = `Bonjour ${username},\n\nCeci est une confirmation que votre compte sur Lendema a été supprimé avec succès, comme vous l'avez demandé. Toutes vos données personnelles ont été effacées de nos systèmes.\nNous sommes désolés de vous voir partir et nous vous remercions pour le temps passé au sein de notre communauté.\n\nL'équipe Lendema`;
        const htmlBody = `
            <p>Bonjour <strong>${username}</strong>,</p>
            <p>Ceci est une confirmation que votre compte sur Lendema a été supprimé avec succès, comme vous l'avez demandé.</p>
            <p>Toutes vos données personnelles ont été effacées de nos systèmes.</p>
            <p>Nous sommes désolés de vous voir partir et nous vous remercions pour le temps passé au sein de notre communauté. Si vous changez d'avis, vous serez toujours le bienvenu.</p>
        `;
        return { subject, text, html: generateHtmlTemplate("Compte supprimé", htmlBody) };
    },
};

export default messageGenerator;