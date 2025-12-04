/**
 * Landing page of the SeePaw platform.
 *
 * @component
 *
 * @description
 * Introductory page that presents the purpose and mission of the platform.
 * Displays a welcome message, a description of the platform, and a slogan.
 * Navigation is handled globally through the Navbar.
 *
 * @example
 * <Route path="/" element={<Home />} />
 *
 * @returns {JSX.Element} The rendered Home page.
 */

import styles from "./Home.module.css";

function Home() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <span className={styles.paw}> </span> Bem-vindo ao SeePaw 🐾
      </h1>

      <p className={styles.paragraph}>
        A SeePaw é uma plataforma dedicada a aproximar pessoas de animais, reunindo, num único
        espaço, informação proveniente de abrigos que desejam dar maior
        visibilidade aos seus patudos.
      </p>

      <p className={styles.paragraph}>
        Acreditamos que a tecnologia pode ser uma ferramenta poderosa no combate
        ao abandono animal e no suporte às associações, muitas vezes
        sobrecarregadas e dependentes de contributos solidários. Cada gesto
        conta, cada ajuda transforma uma vida — juntos, fazemos a diferença!
      </p>

        <p className={styles.paragraph}>
        Descobre animais adoráveis disponíveis para adoção especial ou
        apadrinhamento. Explora o catálogo como convidado ou inicia sessão
        para aceder a todas as funcionalidades.
      </p>

      <h2 className={styles.slogan}>“Humanos porreiros adotam rafeiros”</h2>

      <div className={styles.illustration}>
        <img src="/dog-and-cat.png" alt="Ilustração de cão e gato" />
      </div>
    </div>
  );
}

export default Home;
