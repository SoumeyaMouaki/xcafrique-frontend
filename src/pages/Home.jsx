import HeroSection from '../components/HeroSection'
import NewsSection from '../components/NewsSection'
import VideosSection from '../components/VideosSection'
import AboutSection from '../components/AboutSection'
import SEO from '../components/SEO'

/**
 * Page d'accueil - Structure modulaire avec tous les composants
 */
const Home = () => {
  return (
    <div>
      <SEO
        title="XCAfrique - Air News, Cross-Checked"
        description="Votre source d'information fiable sur l'actualité aéronautique africaine. Actualités, réglementation, infrastructure et plus encore."
        keywords="aviation, aéronautique, Afrique, actualité aérienne, compagnies aériennes africaines"
      />

      {/* HeroSection */}
      <HeroSection />

      {/* NewsSection */}
      <NewsSection />

      {/* VideosSection */}
      <VideosSection />

      {/* AboutSection */}
      <AboutSection />
    </div>
  )
}

export default Home
