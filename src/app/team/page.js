
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa'

export default function TeamPage() {
  const teamMembers = [
    {
      name: 'Arga Mulyana Saptura',
      role: 'UI/UX Designer',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      socials: [
        { icon: <FaGithub />, url: '#' },
        { icon: <FaLinkedin />, url: '#' },
        { icon: <FaTwitter />, url: '#' }
      ]
    },
    {
      name: 'Nabil Bintang Ardiansyah Purwanto',
      role: 'Frontend Developer',
      image: 'https://randomuser.me/api/portraits/men/44.jpg',
      socials: [
        { icon: <FaGithub />, url: '#' },
        { icon: <FaLinkedin />, url: '#' },
        { icon: <FaInstagram />, url: '#' }
      ]
    },
    {
      name: 'Cielo Reksana Jaya',
      role: 'Backend Developer',
      image: 'https://randomuser.me/api/portraits/men/67.jpg',
      socials: [
        { icon: <FaGithub />, url: '#' },
        { icon: <FaTwitter />, url: '#' },
        { icon: <FaInstagram />, url: '#' }
      ]
    },
    {
      name: 'Rajwa Vourza Tsaqifa',
      role: 'Project Manager & System Analyst',
      image: 'https://randomuser.me/api/portraits/men/68.jpg',
      socials: [
        { icon: <FaGithub />, url: '#' },
        { icon: <FaLinkedin />, url: '#' },
        { icon: <FaTwitter />, url: '#' }
      ]
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-accent mb-2">Our Team</h1>
        <div className="w-24 h-1 bg-accent mx-auto mb-4"></div>
        <p className="text-white-600 max-w-2xl mx-auto">
          Meet the talented individuals behind Wangku who work tirelessly to bring you the best currency and stock tracking experience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {teamMembers.map((member, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex justify-center mb-4">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-primary"
                />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-800">{member.name}</h3>
                <p className="text-gray-500 mb-4">{member.role}</p>
                <div className="flex justify-center space-x-4">
                  {member.socials.map((social, i) => (
                    <a 
                      key={i}
                      href={social.url}
                      className="text-gray-500 hover:text-primary transition-colors"
                      aria-label={`${member.name}'s social media`}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}