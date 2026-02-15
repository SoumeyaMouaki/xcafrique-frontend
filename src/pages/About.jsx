import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import SEO from '../components/SEO'

/**
 * Page À propos - Présentation du blog et de la journaliste
 */
const About = () => {
  const { t } = useTranslation()
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <SEO
        title={t('about.title') + ' - XCAfrique'}
        description="Découvrez XCAfrique, le blog professionnel d'actualité aéronautique africaine, et Soumeya Mouaki Benani Benani, journaliste et consultante en communication spécialisée dans le secteur aérien."
        keywords="à propos, XCAfrique, journaliste aviation, blog aéronautique, Soumeya Mouaki Benani Benani"
      />
      <h1 className="text-4xl font-bold text-primary-dark mb-8 text-center">
        {t('about.title')}
      </h1>

      {/* Section Présentation du blog */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-primary-dark mb-4">
          {t('about.mission')}
        </h2>
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 mb-4">
            <strong>XCAfrique</strong> {t('about.missionText1')}
          </p>
          <p className="text-gray-700 mb-4">
            {t('about.missionText2')}
          </p>
          <p className="text-gray-700 mb-4">
            {t('about.missionText3')}
          </p>
          <p className="text-gray-700">
            {t('about.missionText4')}
          </p>
        </div>
      </section>

      {/* Section À propos de la journaliste */}
      <section className="mb-12 bg-gray-50 rounded-lg p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden flex-shrink-0 shadow-lg border-4 border-white">
            <img
              src="/pro-photo.png"
              alt="Soumeya Mouaki Benani Benani"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-primary-dark mb-2">
              Soumeya Mouaki Benani Benani
            </h2>
            <p className="text-lg font-semibold text-primary-dark mb-2">
              {t('about.founder')}
            </p>
             
              <p className="text-gray-700 mb-4">
                {t('about.founderBio1')}
              </p>
              <p className="text-gray-700 mb-4">
                {t('about.founderBio2')}
              </p>
              <p className="text-gray-700">
                {t('about.founderBio3')}
              </p>
            </div>
          </div>
      </section>

      {/* Section Valeurs */}
      <section>
        <h2 className="text-2xl font-semibold text-primary-dark mb-6">
          {t('about.values')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border-l-4 border-primary-dark p-6 rounded">
            <h3 className="text-xl font-semibold text-primary-dark mb-2">
              {t('about.reliability')}
            </h3>
            <p className="text-gray-700">
              {t('about.reliabilityText')}
            </p>
          </div>
          <div className="bg-white border-l-4 border-accent-orange p-6 rounded">
            <h3 className="text-xl font-semibold text-primary-dark mb-2">
              {t('about.professionalism')}
            </h3>
            <p className="text-gray-700">
              {t('about.professionalismText')}
            </p>
          </div>
          <div className="bg-white border-l-4 border-primary-light p-6 rounded">
            <h3 className="text-xl font-semibold text-primary-dark mb-2">
              {t('about.independence')}
            </h3>
            <p className="text-gray-700">
              {t('about.independenceText')}
            </p>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <div className="mt-12 text-center">
        <Link
          to="/contact"
          className="btn-primary inline-block"
        >
          {t('about.contactUs')}
        </Link>
      </div>
    </div>
  )
}

export default About

