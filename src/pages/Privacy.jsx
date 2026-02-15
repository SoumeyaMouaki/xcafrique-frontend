import SEO from '../components/SEO'

/**
 * Page Politique de Confidentialité - Conforme RGPD
 */
const Privacy = () => {
  const currentYear = new Date().getFullYear()

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <SEO
        title="Politique de Confidentialité - XCAfrique"
        description="Politique de confidentialité et gestion des cookies de XCAfrique. Découvrez comment nous collectons, utilisons et protégeons vos données personnelles."
        keywords="politique de confidentialité, cookies, RGPD, protection des données, XCAfrique"
      />

      <h1 className="text-4xl font-bold text-primary-dark mb-8 text-center">
        Politique de Confidentialité
      </h1>

      <div className="prose prose-lg max-w-none">
        <p className="text-gray-600 mb-6">
          <strong>Dernière mise à jour :</strong> {new Date().toLocaleDateString('fr-FR', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-primary-dark mb-4">
            1. Introduction
          </h2>
          <p className="text-gray-700 mb-4">
            XCAfrique ("nous", "notre", "nos") s'engage à protéger votre vie privée. Cette politique de confidentialité 
            explique comment nous collectons, utilisons, divulguons et protégeons vos informations lorsque vous visitez 
            notre site web <strong>xcafrique.org</strong>.
          </p>
          <p className="text-gray-700">
            En utilisant notre site, vous acceptez les pratiques décrites dans cette politique de confidentialité.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-primary-dark mb-4">
            2. Données collectées
          </h2>
          <h3 className="text-xl font-semibold text-primary-dark mb-3">
            2.1 Données collectées automatiquement
          </h3>
          <p className="text-gray-700 mb-4">
            Lorsque vous visitez notre site, nous collectons automatiquement certaines informations via Google Analytics et Google AdSense :
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>Adresse IP (anonymisée pour Analytics)</li>
            <li>Type de navigateur et système d'exploitation</li>
            <li>Pages visitées et durée de visite</li>
            <li>Source de trafic (moteur de recherche, lien direct, etc.)</li>
            <li>Données de géolocalisation approximative (pays, ville)</li>
            <li>Centres d'intérêt (pour la personnalisation des publicités AdSense)</li>
          </ul>

          <h3 className="text-xl font-semibold text-primary-dark mb-3">
            2.2 Données fournies volontairement
          </h3>
          <p className="text-gray-700 mb-4">
            Si vous utilisez notre formulaire de contact, nous collectons :
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>Nom</li>
            <li>Adresse e-mail</li>
            <li>Sujet et message</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-primary-dark mb-4">
            3. Utilisation des données
          </h2>
          <p className="text-gray-700 mb-4">
            Nous utilisons les données collectées pour :
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>Améliorer l'expérience utilisateur de notre site</li>
            <li>Analyser le trafic et comprendre comment les visiteurs utilisent notre site</li>
            <li>Répondre à vos demandes de contact</li>
            <li>Assurer la sécurité et prévenir les abus</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-primary-dark mb-4">
            4. Cookies
          </h2>
          <h3 className="text-xl font-semibold text-primary-dark mb-3">
            4.1 Qu'est-ce qu'un cookie ?
          </h3>
          <p className="text-gray-700 mb-4">
            Un cookie est un petit fichier texte stocké sur votre appareil lorsque vous visitez un site web. 
            Il permet au site de mémoriser vos préférences et d'améliorer votre expérience.
          </p>

          <h3 className="text-xl font-semibold text-primary-dark mb-3">
            4.2 Cookies utilisés sur notre site
          </h3>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h4 className="font-semibold text-primary-dark mb-2">Cookies analytiques (Google Analytics)</h4>
            <p className="text-gray-700 text-sm mb-2">
              <strong>Finalité :</strong> Analyser le trafic et le comportement des visiteurs
            </p>
            <p className="text-gray-700 text-sm mb-2">
              <strong>Durée :</strong> 2 ans maximum
            </p>
            <p className="text-gray-700 text-sm mb-2">
              <strong>Consentement requis :</strong> Oui (vous pouvez refuser via la bannière de cookies)
            </p>
            <p className="text-gray-700 text-sm">
              <strong>Politique de confidentialité Google :</strong>{' '}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary-dark hover:text-accent-orange underline">
                https://policies.google.com/privacy
              </a>
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h4 className="font-semibold text-primary-dark mb-2">Cookies publicitaires (Google AdSense)</h4>
            <p className="text-gray-700 text-sm mb-2">
              <strong>Finalité :</strong> Afficher des publicités personnalisées et mesurer leur performance
            </p>
            <p className="text-gray-700 text-sm mb-2">
              <strong>Durée :</strong> Variable (généralement 1 à 2 ans)
            </p>
            <p className="text-gray-700 text-sm mb-2">
              <strong>Consentement requis :</strong> Oui (vous pouvez refuser via la bannière de cookies)
            </p>
            <p className="text-gray-700 text-sm">
              <strong>Politique de confidentialité Google :</strong>{' '}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary-dark hover:text-accent-orange underline">
                https://policies.google.com/privacy
              </a>
            </p>
          </div>

          <h3 className="text-xl font-semibold text-primary-dark mb-3">
            4.3 Gestion des cookies
          </h3>
          <p className="text-gray-700 mb-4">
            Vous pouvez gérer vos préférences de cookies à tout moment :
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>Via la bannière de cookies affichée lors de votre première visite</li>
            <li>En supprimant les cookies de votre navigateur</li>
            <li>En configurant votre navigateur pour bloquer les cookies (cela peut affecter certaines fonctionnalités)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-primary-dark mb-4">
            5. Partage des données
          </h2>
          <p className="text-gray-700 mb-4">
            Nous ne vendons, ne louons ni ne partageons vos données personnelles avec des tiers, sauf dans les cas suivants :
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>
              <strong>Google Analytics :</strong> Les données analytiques sont transmises à Google conformément à leur 
              politique de confidentialité. Les adresses IP sont anonymisées.
            </li>
            <li>
              <strong>Google AdSense :</strong> Les données de navigation peuvent être utilisées pour afficher des publicités 
              personnalisées. Ces données sont transmises à Google conformément à leur politique de confidentialité.
            </li>
            <li>
              <strong>Obligations légales :</strong> Si la loi l'exige, nous pouvons divulguer vos informations.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-primary-dark mb-4">
            6. Vos droits (RGPD)
          </h2>
          <p className="text-gray-700 mb-4">
            Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li><strong>Droit d'accès :</strong> Vous pouvez demander une copie de vos données personnelles</li>
            <li><strong>Droit de rectification :</strong> Vous pouvez corriger vos données inexactes</li>
            <li><strong>Droit à l'effacement :</strong> Vous pouvez demander la suppression de vos données</li>
            <li><strong>Droit d'opposition :</strong> Vous pouvez vous opposer au traitement de vos données</li>
            <li><strong>Droit à la portabilité :</strong> Vous pouvez récupérer vos données dans un format structuré</li>
            <li><strong>Droit de retirer votre consentement :</strong> Vous pouvez retirer votre consentement aux cookies à tout moment</li>
          </ul>
          <p className="text-gray-700">
            Pour exercer ces droits, contactez-nous à : <strong>contact@xcafrique.org</strong>
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-primary-dark mb-4">
            7. Sécurité des données
          </h2>
          <p className="text-gray-700 mb-4">
            Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées pour protéger 
            vos données personnelles contre l'accès non autorisé, la perte, la destruction ou l'altération.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-primary-dark mb-4">
            8. Conservation des données
          </h2>
          <p className="text-gray-700 mb-4">
            Nous conservons vos données personnelles uniquement aussi longtemps que nécessaire pour les finalités 
            pour lesquelles elles ont été collectées, ou conformément aux obligations légales.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-primary-dark mb-4">
            9. Modifications de cette politique
          </h2>
          <p className="text-gray-700 mb-4">
            Nous pouvons mettre à jour cette politique de confidentialité de temps à autre. La date de dernière 
            mise à jour est indiquée en haut de cette page. Nous vous encourageons à consulter régulièrement cette page.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-primary-dark mb-4">
            10. Contact
          </h2>
          <p className="text-gray-700 mb-4">
            Pour toute question concernant cette politique de confidentialité ou vos données personnelles, 
            vous pouvez nous contacter :
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700">
              <strong>Email :</strong> contact@xcafrique.org
            </p>
            <p className="text-gray-700 mt-2">
              <strong>Site web :</strong> xcafrique.org
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Privacy

