import { Link } from 'react-router-dom'
import SEO from '../components/SEO'

/**
 * Page À propos - Présentation du blog et de la journaliste
 */
const About = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <SEO
        title="À propos - XCAfrique"
        description="Découvrez XCAfrique, le blog professionnel d'actualité aéronautique africaine, et Soumeya Mouaki Benani Benani, journaliste et consultante en communication spécialisée dans le secteur aérien."
        keywords="à propos, XCAfrique, journaliste aviation, blog aéronautique, Soumeya Mouaki Benani Benani"
      />
      <h1 className="text-4xl font-bold text-primary-dark mb-8 text-center">
        À propos de XCAfrique
      </h1>

      {/* Section Présentation du blog */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-primary-dark mb-4">
          Notre mission
        </h2>
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 mb-4">
            <strong>XCAfrique</strong> est un média professionnel dédié à l'actualité aéronautique africaine. Notre ambition est d'offrir une information fiable, vérifiée et contextualisée sur l'ensemble du secteur aérien du continent.
          </p>
          <p className="text-gray-700 mb-4">
            Dans un environnement où l'information circule vite, parfois de manière incomplète ou non vérifiée, <strong>XCAfrique</strong> se positionne comme une plateforme de référence pour les professionnels de l'aviation, les passionnés et tous ceux qui suivent l'évolution du transport aérien en Afrique.
          </p>
          <p className="text-gray-700 mb-4">
            Nous couvrons un large éventail de thématiques : actualité des compagnies aériennes, sécurité et réglementation, infrastructures aéroportuaires, formation, innovation, marché africain, développement durable et analyse sectorielle.
          </p>
          <p className="text-gray-700">
            Notre approche repose sur trois piliers : <strong>rigueur</strong>, <strong>transparence</strong> et <strong>vérification</strong> systématique des faits. Nous privilégions une information claire, documentée et utile, pensée pour accompagner la croissance d'un secteur stratégique.
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
              Fondatrice & CEO de XCAfrique
            </p>
            <h3 className="text-lg text-accent-gray mb-4">
              Journaliste & consultante en communication spécialisée dans le secteur aérien
            </h3>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">
                Soumeya Mouaki Benani Benani est journaliste et consultante en communication spécialisée dans le secteur aérien, avec un parcours unique mêlant pratique opérationnelle, expertise médiatique et analyse stratégique.
              </p>
              <p className="text-gray-700 mb-4">
                Diplômée d'un master en communication et relations publiques, elle a travaillé plusieurs années comme Personnel Navigant Commercial, une expérience qui lui a offert une connaissance concrète des opérations aériennes, de la sûreté et des réalités internes du transport aérien.
              </p>
              <p className="text-gray-700 mb-4">
                Passionnée par l'aviation et la production d'information fiable, elle a également collaboré comme rédactrice web, développant un style clair, précis et documenté. Son champ d'expertise touche à l'actualité aéronautique, la sécurité, l'innovation, les compagnies aériennes, l'expérience passager et l'évolution des métiers du secteur.
              </p>
              <p className="text-gray-700">
                Convaincue de l'importance d'un média sérieux et rigoureux pour accompagner le développement du transport aérien en Afrique, elle a fondé XCAfrique, une plateforme dédiée à l'analyse, à la vérification et à la diffusion d'informations aéronautiques fiables. À travers XCAfrique, elle défend une information factuelle, structurée et transparente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Valeurs */}
      <section>
        <h2 className="text-2xl font-semibold text-primary-dark mb-6">
          Nos valeurs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border-l-4 border-primary-dark p-6 rounded">
            <h3 className="text-xl font-semibold text-primary-dark mb-2">
              Fiabilité
            </h3>
            <p className="text-gray-700">
              Chaque information est vérifiée et croisée avec plusieurs sources avant publication.
            </p>
          </div>
          <div className="bg-white border-l-4 border-accent-orange p-6 rounded">
            <h3 className="text-xl font-semibold text-primary-dark mb-2">
              Professionnalisme
            </h3>
            <p className="text-gray-700">
              Un traitement rigoureux et approfondi de l'actualité aéronautique africaine.
            </p>
          </div>
          <div className="bg-white border-l-4 border-primary-light p-6 rounded">
            <h3 className="text-xl font-semibold text-primary-dark mb-2">
              Indépendance
            </h3>
            <p className="text-gray-700">
              Une approche éditoriale indépendante et objective, sans influence extérieure.
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
          Nous contacter
        </Link>
      </div>
    </div>
  )
}

export default About

