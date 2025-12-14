import { useState } from 'react'
import API from '../api'

/**
 * ContactForm.js
 * - Envoie POST /contact au backend via API (axios)
 * - Props optionnelles :
 *    onSuccess(message) : callback appelé après envoi réussi
 */
const ContactForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null) // 'success' | 'error' | null
  const [errorMsg, setErrorMsg] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validate = () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg('Veuillez remplir les champs obligatoires : nom, email et message.')
      return false
    }
    // Validation simple de l'email
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrorMsg('Veuillez fournir une adresse email valide.')
      return false
    }
    setErrorMsg('')
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) {
      setSubmitStatus('error')
      return
    }

    setIsSubmitting(true)
    setSubmitStatus(null)
    setErrorMsg('')

    try {
      // Remarque : API doit avoir baseURL = http://.../api ou adapter l'endpoint
      await API.post('/contact', formData)
      setSubmitStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
      if (onSuccess) onSuccess('Message envoyé avec succès. Merci !')
      // réinitialiser le message après quelques secondes
      setTimeout(() => setSubmitStatus(null), 5000)
    } catch (err) {
      console.error('Erreur envoi contact:', err)
      // essayer d'extraire un message côté serveur si disponible
      const serverMsg = err?.response?.data?.message || 'Impossible d’envoyer le message pour le moment.'
      setErrorMsg(serverMsg)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Erreur côté validation / serveur */}
      {submitStatus === 'success' && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
          Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.
        </div>
      )}
      {submitStatus === 'error' && errorMsg && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          {errorMsg}
        </div>
      )}

      {/* Nom */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Nom complet *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent"
          placeholder="Votre nom"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent"
          placeholder="votre.email@exemple.com"
        />
      </div>

      {/* Sujet */}
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
          Sujet
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent"
          placeholder="Sujet (optionnel)"
        />
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows="6"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent resize-none"
          placeholder="Votre message..."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`btn-primary w-full ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
      </button>
    </form>
  )
}

export default ContactForm
