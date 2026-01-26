import ContactForm from '../components/ContactForm'
import SEO from '../components/SEO'

/**
 * Page Contact - Formulaire de contact et informations de contact
 */
const Contact = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <SEO
        title="Contact - XCAfrique"
        description="Contactez XCAfrique pour toute question, suggestion ou demande d'information sur l'actualité aéronautique africaine."
        keywords="contact, XCAfrique, formulaire contact"
      />
      <h1 className="text-4xl font-bold text-primary-dark mb-4 text-center">
        Contactez-nous
      </h1>
      <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
        Une question, une suggestion ou une demande d'information ? 
        N'hésitez pas à nous contacter. Nous vous répondrons dans les plus brefs délais.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulaire de contact */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-primary-dark mb-6">
              Envoyez-nous un message
            </h2>
            <ContactForm />
          </div>
        </div>

        {/* Informations de contact */}
        <aside className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-primary-dark mb-4">
              Informations de contact
            </h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-primary-dark mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="font-medium text-gray-900">Email</p>
                  <p className="text-gray-600">contact@xcafrique.org</p>
                </div>
              </div>
            </div>
          </div>

          {/* Réseaux sociaux */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-primary-dark mb-4">
              Suivez-nous
            </h3>
            <p className="text-gray-600 mb-4 text-sm">
              Restez connecté avec nous sur les réseaux sociaux pour ne rien manquer de l'actualité.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com/xcafrique"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-dark hover:text-accent-orange transition-colors"
                aria-label="Twitter"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/xcafrique/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-dark hover:text-accent-orange transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@xcafrique?lang=fr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-dark hover:text-accent-orange transition-colors"
                aria-label="TikTok"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/soumeya-mouaki-benani-benani-7315b2398"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-dark hover:text-accent-orange transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default Contact

