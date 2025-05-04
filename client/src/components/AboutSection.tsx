export default function AboutSection() {
  return (
    <section id="about" className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Sobre a Plataforma</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Uma nova forma de financiar inovação
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            TourChain Connect é uma plataforma de crowdfunding descentralizada que conecta viajantes, empresas 
            e investidores para financiar o futuro das viagens corporativas.
          </p>
        </div>

        <div className="mt-10">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <div className="pt-6">
              <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow-sm h-full">
                <div className="-mt-6">
                  <div>
                    <span className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-primary to-secondary rounded-md shadow-lg">
                      <i className="fas fa-cubes text-white text-xl"></i>
                    </span>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Blockchain</h3>
                  <p className="mt-5 text-base text-gray-500">
                    Utilizamos smart contracts para garantir que todas as transações sejam transparentes, seguras e verificáveis.
                    Eliminamos intermediários, reduzindo custos e aumentando a confiança.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow-sm h-full">
                <div className="-mt-6">
                  <div>
                    <span className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-primary to-secondary rounded-md shadow-lg">
                      <i className="fas fa-leaf text-white text-xl"></i>
                    </span>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Sustentabilidade</h3>
                  <p className="mt-5 text-base text-gray-500">
                    Incentivamos escolhas eco-conscientes com compensação de carbono integrada e premiamos projetos 
                    que promovem práticas sustentáveis de viagem.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow-sm h-full">
                <div className="-mt-6">
                  <div>
                    <span className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-primary to-secondary rounded-md shadow-lg">
                      <i className="fas fa-heart text-white text-xl"></i>
                    </span>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Bem-estar</h3>
                  <p className="mt-5 text-base text-gray-500">
                    Focamos na experiência do viajante com recomendações personalizadas, suporte contínuo
                    e ferramentas que melhoram a qualidade das viagens corporativas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
