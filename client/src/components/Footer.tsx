export default function Footer() {
  return (
    <footer className="bg-white">
      <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
        <nav className="-mx-5 -my-2 flex flex-wrap justify-center" aria-label="Footer">
          <div className="px-5 py-2">
            <a href="#" className="text-gray-500 hover:text-gray-900">
              Sobre
            </a>
          </div>
          <div className="px-5 py-2">
            <a href="#" className="text-gray-500 hover:text-gray-900">
              Como Funciona
            </a>
          </div>
          <div className="px-5 py-2">
            <a href="#" className="text-gray-500 hover:text-gray-900">
              FAQ
            </a>
          </div>
          <div className="px-5 py-2">
            <a href="#" className="text-gray-500 hover:text-gray-900">
              Termos
            </a>
          </div>
          <div className="px-5 py-2">
            <a href="#" className="text-gray-500 hover:text-gray-900">
              Privacidade
            </a>
          </div>
          <div className="px-5 py-2">
            <a href="#" className="text-gray-500 hover:text-gray-900">
              Contato
            </a>
          </div>
        </nav>
        <div className="mt-8 flex justify-center space-x-6">
          <a href="#" className="text-gray-400 hover:text-gray-500">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#" className="text-gray-400 hover:text-gray-500">
            <i className="fab fa-github"></i>
          </a>
          <a href="#" className="text-gray-400 hover:text-gray-500">
            <i className="fab fa-discord"></i>
          </a>
          <a href="#" className="text-gray-400 hover:text-gray-500">
            <i className="fab fa-telegram"></i>
          </a>
        </div>
        <p className="mt-8 text-center text-gray-400 text-sm">
          &copy; 2023 TourChain Connect. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
