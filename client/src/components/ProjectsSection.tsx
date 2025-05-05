import ProjectCard from "@/components/ProjectCard";

export default function ProjectsSection() {
  const projects = [
    {
      id: 1,
      title: "CrowdFundConnect: Revolução nas Viagens Corporativas",
      description: "Transformando viagens corporativas com blockchain, bem-estar e sustentabilidade",
      raised: 67500,
      goal: 100000,
      daysLeft: 18,
      backers: 285,
      category: "Blockchain",
      imageColor: "from-primary to-secondary"
    },
    {
      id: 2,
      title: "EcoTravel: Plataforma de Compensação de Carbono",
      description: "Sistema de rastreamento e compensação de carbono para viagens corporativas usando tokens verdes",
      raised: 42000,
      goal: 80000,
      daysLeft: 12,
      backers: 156,
      category: "Sustentabilidade",
      imageColor: "from-green-500 to-teal-500"
    },
    {
      id: 3,
      title: "BusinessWell: Bem-estar em Viagens",
      description: "Aplicativo que monitora e recompensa hábitos saudáveis durante viagens corporativas",
      raised: 25000,
      goal: 50000,
      daysLeft: 30,
      backers: 118,
      category: "Bem-estar",
      imageColor: "from-blue-500 to-cyan-500"
    },
    {
      id: 4,
      title: "CryptoHotels: Reservas com Blockchain",
      description: "Plataforma descentralizada para reservas de hotéis com pagamentos em criptomoedas",
      raised: 120000,
      goal: 150000,
      daysLeft: 5,
      backers: 340,
      category: "Blockchain",
      imageColor: "from-purple-600 to-violet-600"
    }
  ];

  return (
    <section id="projects" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center mb-10">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Projetos em Destaque</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Apoie Ideias Inovadoras
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Confira os projetos que estão redefinindo o futuro das viagens corporativas através de tecnologia blockchain.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
}
