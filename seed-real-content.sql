-- ================================================================
-- ComboXplora — Seed de contenido real 2026
-- ================================================================
-- ADVERTENCIA: Este script elimina todos los hacedores y experiencias
-- actuales (de ejemplo) y los reemplaza con los datos reales.
--
-- Ejecutar en: Supabase Dashboard → SQL Editor → New query → Run
-- ================================================================

-- 1. Limpiar datos de ejemplo
DELETE FROM hacedores;
DELETE FROM experiencias;

-- ================================================================
-- 2. HACEDORES (18)
-- ================================================================
INSERT INTO hacedores (
  id, name, slug, profile_image, cover_image,
  category, neighborhood,
  short_description, full_story,
  gallery, instagram, whatsapp,
  specialties, experiences,
  is_active, created_at
) VALUES

-- 1. Sabina Martínez Iglesias
('hac_sabina01', 'Sabina Martínez Iglesias', 'sabina-martinez-iglesias',
 '/images/hacedores/sabina-martinez-iglesias.jpg',
 '/images/hacedores/sabina-martinez-iglesias.jpg',
 'Artesanía', 'Barrio Abajo',
 'Artesana, cocinera tradicional y gestora cultural del Barrio Abajo de Barranquilla. A través de sus saberes preserva y comparte las tradiciones, la gastronomía y el patrimonio cultural del Caribe colombiano.',
 'Desde hace más de 20 años, Sabina Martínez Iglesias dedica su vida a mantener vivas las tradiciones del Barrio Abajo de Barranquilla. A través de la artesanía, la cocina tradicional y la promoción del patrimonio cultural, comparte con orgullo los saberes que identifican al Caribe colombiano. Su trabajo como líder cultural y comunitaria refleja su compromiso con preservar la memoria, fortalecer la identidad del territorio y transmitir estas tradiciones a quienes desean conocerlas y vivirlas.',
 ARRAY[]::text[], 'https://www.instagram.com/sabinamartinezaccesorios/', '573122475789',
 ARRAY['Artesanía tradicional','Cocina tradicional del Caribe','Patrimonio cultural','Turismo cultural','Guianza patrimonial','Gestión cultural','Liderazgo comunitario'],
 ARRAY[]::text[], true, NOW()),

-- 2. Luzselli Daleni Mejía Flórez
('hac_luzsel01', 'Luzselli Daleni Mejía Flórez', 'luzselli-mejia-florez',
 '/images/hacedores/luzselli-mejia-florez.jpg',
 '/images/hacedores/luzselli-mejia-florez.jpg',
 'Gastronomía', 'Barrio Abajo del Río',
 'Cocinera tradicional y gestora cultural del Barrio Abajo. Promueve la gastronomía ancestral y el patrimonio cultural del Caribe colombiano a través de experiencias que preservan los sabores y las tradiciones de su territorio.',
 'Luzselli Daleni Mejía Flórez es cocinera tradicional y gestora cultural del Barrio Abajo de Barranquilla. Desde hace más de ocho años trabaja en la Fundación Cultural Casa Morón, un espacio dedicado a fortalecer las expresiones artísticas y culturales del territorio. A través de la cocina tradicional elabora productos alimentarios saludables inspirados en recetas ancestrales, contribuyendo a la preservación del patrimonio gastronómico del Caribe y compartiendo con orgullo los saberes que hacen parte de la identidad de su comunidad.',
 ARRAY[]::text[], 'https://www.instagram.com/moroncasa', '573122475789',
 ARRAY['Cocina tradicional del Caribe','Gastronomía ancestral','Patrimonio gastronómico','Productos alimentarios saludables','Gestión cultural','Saberes tradicionales','Cultura del Barrio Abajo'],
 ARRAY[]::text[], true, NOW()),

-- 3. Analida del Rosario Pedroza Zúñiga
('hac_analid01', 'Analida del Rosario Pedroza Zúñiga', 'analida-pedroza-zuniga',
 '/images/hacedores/analida-pedroza-zuniga.jpg',
 '/images/hacedores/analida-pedroza-zuniga.jpg',
 'Artesanía', 'Barrio Abajo del Río',
 'Artesana y cocinera tradicional del Barrio Abajo. A través del trabajo en totumo y la cocina tradicional preserva los saberes, los oficios y la identidad cultural del Caribe colombiano.',
 'Analida del Rosario Pedroza Zúñiga es artesana y cocinera tradicional del Barrio Abajo de Barranquilla. Desde hace más de cuatro años trabaja en la elaboración de accesorios artesanales en totumo y en la preparación de recetas tradicionales que hacen parte del patrimonio gastronómico del Caribe. Su labor busca mantener vivos los saberes ancestrales, resaltando el valor de los materiales naturales, la creatividad y las tradiciones que identifican a su territorio.',
 ARRAY[]::text[], 'https://www.instagram.com/artanalida', '573122475789',
 ARRAY['Artesanía en totumo','Accesorios artesanales','Cocina tradicional del Caribe','Gastronomía tradicional','Patrimonio cultural','Saberes ancestrales','Economía creativa'],
 ARRAY[]::text[], true, NOW()),

-- 4. Daniel Amador
('hac_daniel01', 'Daniel Amador', 'daniel-amador',
 '/images/hacedores/daniel-amador.jpg',
 '/images/hacedores/daniel-amador.jpg',
 'Gastronomía', 'Barranquilla',
 'Chef y cocinero tradicional con más de 10 años de experiencia. Diseña experiencias gastronómicas interactivas que conectan a visitantes y locales con los sabores, las técnicas y la cultura culinaria del Caribe colombiano.',
 'Daniel Amador es chef y cocinero tradicional con más de diez años de trayectoria en la gastronomía y dos años dedicado a crear experiencias culinarias para turistas y visitantes. A través de clases de cocina interactivas, caterings y actividades de integración, comparte los sabores, las técnicas y las historias que hacen parte de la cocina del Caribe colombiano. Su propuesta busca que cada participante aprenda, cocine y viva la gastronomía local como una experiencia cercana, auténtica y memorable.',
 ARRAY[]::text[], 'https://www.instagram.com/daniamador24/', '573122475789',
 ARRAY['Cocina tradicional del Caribe','Clases de cocina para turistas','Experiencias gastronómicas','Turismo gastronómico','Catering','Team building gastronómico','Cocina interactiva'],
 ARRAY[]::text[], true, NOW()),

-- 5. Mabel Monterrosa Oviedo
('hac_mabel01', 'Mabel Monterrosa Oviedo', 'mabel-monterrosa-oviedo',
 '/images/hacedores/mabel-monterrosa-oviedo.jpg',
 '/images/hacedores/mabel-monterrosa-oviedo.jpg',
 'Artesanía', 'La Victoria',
 'Artesana, narradora oral y líder cultural que promueve los saberes ancestrales afrodescendientes a través del cuidado capilar, la oralidad y el uso de ingredientes tradicionales como la manteca de corozo.',
 'Mabel Monterrosa Oviedo es artesana, narradora oral y líder cultural con una profunda convicción por preservar y compartir los saberes ancestrales de la cultura afrodescendiente. Desde hace cuatro años lidera procesos culturales en los que enseña a nuevas generaciones el valor de las tradiciones, la memoria y la identidad. A través de su emprendimiento de cuidado capilar, elaborado con ingredientes ancestrales como la manteca de corozo, transforma los conocimientos heredados en una propuesta que promueve el bienestar, el reconocimiento de las raíces y el orgullo por la cultura del Caribe.',
 ARRAY[]::text[], 'https://www.instagram.com/montenegra.co/', '573122475789',
 ARRAY['Cuidado capilar ancestral','Productos elaborados con manteca de corozo','Artesanía','Narración oral','Saberes afrodescendientes','Patrimonio cultural','Liderazgo cultural','Tradiciones del Caribe colombiano'],
 ARRAY[]::text[], true, NOW()),

-- 6. Edilsa Marina Arroyo Piña
('hac_edilsa01', 'Edilsa Marina Arroyo Piña', 'edilsa-arroyo-pina',
 '/images/hacedores/edilsa-arroyo-pina.jpg',
 '/images/hacedores/edilsa-arroyo-pina.jpg',
 'Artesanía', 'Villa Muvdi',
 'Artesana con más de 30 años de trayectoria dedicada a preservar la cultura Zenú a través del tejido en telar vertical, transformando los saberes ancestrales en piezas que mantienen viva la memoria de este pueblo indígena.',
 'Edilsa Marina Arroyo Piña es artesana con más de 30 años de experiencia en el tejido tradicional. A través de su emprendimiento Ritmos de Telar, preserva y promueve el legado cultural del pueblo Zenú mediante la elaboración de artesanías utilizando la técnica del telar vertical. Cada una de sus creaciones refleja la riqueza de los saberes ancestrales transmitidos de generación en generación, convirtiéndose en una expresión viva de la identidad, la memoria y el patrimonio cultural del Caribe colombiano.',
 ARRAY[]::text[], 'https://www.instagram.com/ritmos_de_telar', '573122475789',
 ARRAY['Tejido en telar vertical','Artesanía Zenú','Patrimonio cultural','Saberes ancestrales','Tejido tradicional','Cultura indígena Zenú','Artesanías hechas a mano','Preservación de tradiciones'],
 ARRAY[]::text[], true, NOW()),

-- 7. Luzmila Trespalacios Petro
('hac_luzmil01', 'Luzmila Trespalacios Petro', 'luzmila-trespalacios-petro',
 '/images/hacedores/luzmila-trespalacios-petro.jpg',
 '/images/hacedores/luzmila-trespalacios-petro.jpg',
 'Artesanía', 'Caribe Verde',
 'Artesana con más de 18 años de experiencia en la elaboración de souvenirs en madera inspirados en el Carnaval de Barranquilla y los principales íconos culturales y turísticos de la ciudad.',
 'Luzmila Trespalacios Petro es una artesana barranquillera con más de 18 años de trayectoria dedicada a transformar la madera en piezas que representan la identidad cultural de la ciudad. A través de sus creaciones elabora souvenirs inspirados en el Carnaval de Barranquilla y en lugares emblemáticos como la Ventana al Mundo, el Gran Malecón y el Puente Pumarejo, permitiendo que visitantes y locales se lleven un recuerdo auténtico del Caribe colombiano.',
 ARRAY[]::text[], 'https://www.instagram.com/artesaniasapue', '573122475789',
 ARRAY['Souvenirs en madera','Artesanía en madera','Carnaval de Barranquilla','Íconos turísticos de Barranquilla','Artesanías hechas a mano','Identidad cultural del Caribe','Recuerdos artesanales','Patrimonio cultural'],
 ARRAY[]::text[], true, NOW()),

-- 8. Anthony Manuel Pertuz Valdés
('hac_anthon01', 'Anthony Manuel Pertuz Valdés', 'anthony-pertuz-valdes',
 '/images/hacedores/anthony-pertuz-valdes.jpg',
 '/images/hacedores/anthony-pertuz-valdes.jpg',
 'Artesanía', 'Galapa',
 'Artesano tallador en madera con más de 18 años de experiencia. Heredero de una tradición familiar, crea piezas inspiradas en el Carnaval de Barranquilla y en la identidad cultural del Caribe colombiano, completamente elaboradas a mano.',
 'Anthony Manuel Pertuz Valdés es un maestro artesano dedicado a la talla en madera, oficio que heredó de su padre, el reconocido maestro artesano Manuel Pertuz. Desde hace más de 18 años transforma la madera en piezas inspiradas en el Carnaval de Barranquilla y en la riqueza cultural del Caribe colombiano, utilizando técnicas tradicionales completamente hechas a mano. En 2024 fue reconocido como Maestro Artesano Contemporáneo por Artesanías de Colombia, distinción que resalta su compromiso con la preservación, la innovación y la proyección de la artesanía colombiana.',
 ARRAY[]::text[], 'https://www.instagram.com/mico.lombia/', '573122475789',
 ARRAY['Talla artesanal en madera','Máscaras del Carnaval de Barranquilla','Artesanía tradicional','Escultura en madera','Patrimonio cultural','Oficios tradicionales','Arte popular colombiano','Artesanía hecha a mano'],
 ARRAY[]::text[], true, NOW()),

-- 9. Karen Castañeda Ortega
('hac_karen01', 'Karen Castañeda Ortega', 'karen-castaneda-ortega',
 '/images/hacedores/karen-castaneda-ortega.jpg',
 '/images/hacedores/karen-castaneda-ortega.jpg',
 'Gastronomía', 'La Unión',
 'Cocinera tradicional que preserva los sabores del Caribe colombiano a través de recetas familiares, especialmente la preparación de hayacas y otros platos típicos que mantienen viva la tradición gastronómica.',
 'Karen Castañeda Ortega es cocinera tradicional y creadora de Sabores de Mamá, un emprendimiento nacido del amor por las recetas heredadas de su familia. Desde hace varios años dedica su trabajo a la preparación de hayacas y otros platos típicos del Caribe colombiano, conservando técnicas y sabores que forman parte de la identidad cultural de la región. A través de su cocina busca mantener vivas las tradiciones gastronómicas, compartiendo con cada preparación el valor de la cocina casera, la memoria y el encuentro alrededor de la mesa.',
 ARRAY[]::text[], 'https://www.instagram.com/saboresdemamabq/', '573122475789',
 ARRAY['Hayacas tradicionales','Cocina tradicional del Caribe','Gastronomía ancestral','Comida típica colombiana','Recetas familiares','Patrimonio gastronómico','Cocina casera','Sabores tradicionales'],
 ARRAY[]::text[], true, NOW()),

-- 10. Alejandra Paola García Otálvaro
('hac_aleja01', 'Alejandra Paola García Otálvaro', 'alejandra-garcia-otalvaro',
 '/images/hacedores/alejandra-garcia-otalvaro.jpg',
 '/images/hacedores/alejandra-garcia-otalvaro.jpg',
 'Artesanía', 'Barranquilla',
 'Artesana especializada en crochet, amigurumis y bisutería hecha a mano. A través de sus creaciones transforma los hilos en piezas únicas que reflejan creatividad, dedicación y el valor del trabajo artesanal.',
 'Alejandra Paola García Otálvaro es artesana con más de seis años de experiencia en la elaboración de tejidos en crochet, amigurumis y bisutería artesanal. Su trabajo combina creatividad, detalle y técnicas tradicionales para dar vida a piezas hechas completamente a mano, convirtiendo cada creación en un producto único. A través de su oficio promueve el valor de la artesanía como una expresión de identidad, dedicación y talento, ofreciendo productos que conservan la esencia del trabajo manual y la creatividad local.',
 ARRAY[]::text[], 'https://www.instagram.com/distrialexa/', '573122475789',
 ARRAY['Tejidos en crochet','Amigurumis','Bisutería artesanal','Artesanía hecha a mano','Tejido creativo','Accesorios artesanales','Productos elaborados en crochet'],
 ARRAY[]::text[], true, NOW()),

-- 11. Jans Joel Montenegro Tobar
('hac_jans01', 'Jans Joel Montenegro Tobar', 'jans-joel-montenegro-tobar',
 '/images/hacedores/jans-joel-montenegro-tobar.jpg',
 '/images/hacedores/jans-joel-montenegro-tobar.jpg',
 'Tradición Oral', 'Villa del Carmen',
 'Narrador oral, guía local y creador audiovisual que da vida a la historia de Barranquilla a través de imágenes, videos y relatos que conectan a las personas con el patrimonio y la identidad del territorio.',
 'Jans Joel Montenegro Tobar es narrador oral, guía local y creador audiovisual con cinco años de experiencia compartiendo la historia y el patrimonio de Barranquilla. A través del video, la fotografía y la narración, invita a descubrir los lugares más representativos de la ciudad desde una mirada cercana y auténtica. Su trabajo busca que cada recorrido y cada historia permitan comprender el valor cultural del territorio, fortaleciendo el sentido de pertenencia y acercando a visitantes y locales a la memoria viva del Caribe colombiano.',
 ARRAY[]::text[], 'https://www.instagram.com/hansmvisual/', '573122475789',
 ARRAY['Narración oral','Guianza local','Patrimonio cultural','Turismo cultural','Creación audiovisual','Fotografía','Producción de video','Interpretación del patrimonio'],
 ARRAY[]::text[], true, NOW()),

-- 12. José Gabriel Guerra Llerena
('hac_joseg01', 'José Gabriel Guerra Llerena', 'jose-gabriel-guerra-llerena',
 '/images/hacedores/jose-gabriel-guerra-llerena.jpg',
 '/images/hacedores/jose-gabriel-guerra-llerena.jpg',
 'Arte Visual', '7 de Abril',
 'Artista y artesano multidisciplinario con más de 20 años de trayectoria. A través de la pintura, la talla, la música y la elaboración de artesanías preserva y promueve la identidad cultural del Caribe colombiano.',
 'José Gabriel Guerra Llerena es un artista y artesano con cerca de 20 años de experiencia dedicados a la creación y preservación de los saberes culturales del Caribe colombiano. En su taller desarrolla una amplia variedad de expresiones artísticas que incluyen retratos al óleo y lápiz, pintura de picós, fabricación de máscaras y muñecos del Carnaval de Barranquilla, artesanías en totumo, música y gastronomía tradicional. Su trabajo refleja la riqueza cultural del territorio y demuestra cómo el arte puede convertirse en una herramienta para mantener vivas las tradiciones y compartirlas con nuevas generaciones.',
 ARRAY[]::text[], 'https://www.instagram.com/josegabrielguerrallerena/', '573122475789',
 ARRAY['Pintura artística (óleo y lápiz)','Máscaras y muñecos del Carnaval de Barranquilla','Artesanías en totumo','Maracas y totumas artesanales','Pintura de picós y sistemas de sonido','Fabricación y reparación de guitarras','Música y animación cultural','Gastronomía tradicional','Arte popular caribeño'],
 ARRAY[]::text[], true, NOW()),

-- 13. Luis Enrique Julio Carvajal
('hac_luise01', 'Luis Enrique Julio Carvajal', 'luis-enrique-julio-carvajal',
 '/images/hacedores/luis-enrique-julio-carvajal.jpg',
 '/images/hacedores/luis-enrique-julio-carvajal.jpg',
 'Teatro', 'La Paz',
 'Artista escénico y visual, gestor cultural y tallerista que, a través del teatro, el collage y la narración, crea experiencias que fortalecen la identidad cultural y el patrimonio de Barranquilla.',
 'Luis Enrique Julio Carvajal es artista escénico y visual, licenciado en Educación Artística y gestor cultural con más de una década de trayectoria en procesos comunitarios y profesionales. Su trabajo integra el teatro, las artes visuales y la narración como herramientas para promover la identidad cultural, la creación colectiva y el fortalecimiento del tejido social. Hace parte del Carnaval de Barranquilla como actor y en 2026 fue reconocido con el Honor al Folclor por su disfraz individual La Bruja Rebluja. Además, dirige el colectivo teatral Pazénico, lidera el proyecto Barrancollage, mediante el cual desarrolla talleres de collage inspirados en la ciudad, y participa como mediador voluntario en el Museo de Arte Moderno de Barranquilla.',
 ARRAY[]::text[], 'https://www.instagram.com/gatoqladra.collage/', '573122475789',
 ARRAY['Teatro','Narración oral','Artes visuales','Collage artístico','Talleres creativos','Gestión cultural','Carnaval de Barranquilla','Mediación cultural','Creación colectiva','Patrimonio cultural'],
 ARRAY[]::text[], true, NOW()),

-- 14. Edgardo José Manga Contreras
('hac_edgar01', 'Edgardo José Manga Contreras', 'edgardo-manga-contreras',
 '', '',
 'Tradición Oral', 'Soledad',
 'Hacedor cultural y líder comunitario que promueve la educación ambiental, la cultura ciudadana y el cuidado del territorio a través del proceso Ecoguardianes, fortaleciendo el tejido social y la identidad del Caribe colombiano.',
 'Edgardo José Manga Contreras es hacedor cultural y líder comunitario con más de cinco años de experiencia impulsando procesos de educación ambiental y cultura ciudadana a través de Ecoguardianes. Su trabajo integra acciones pedagógicas, artísticas y comunitarias que promueven el cuidado del entorno, el liderazgo juvenil y la apropiación del territorio. Mediante talleres, jornadas comunitarias, intervenciones culturales y espacios de diálogo, fortalece la identidad local y fomenta una ciudadanía comprometida con la sostenibilidad y la transformación social en el Caribe colombiano.',
 ARRAY[]::text[], 'https://www.instagram.com/ecoguardia/', '573122475789',
 ARRAY['Educación ambiental','Cultura ciudadana','Liderazgo comunitario','Participación comunitaria','Talleres formativos','Gestión cultural','Desarrollo territorial','Sostenibilidad','Patrimonio e identidad local','Producción audiovisual comunitaria'],
 ARRAY[]::text[], true, NOW()),

-- 15. Valentina Palacio Ascencio
('hac_valen01', 'Valentina Palacio Ascencio', 'valentina-palacio-ascencio',
 '/images/hacedores/valentina-palacio-ascencio.jpg',
 '/images/hacedores/valentina-palacio-ascencio.jpg',
 'Tradición Oral', 'Los Pinos',
 'Comunicadora social y gestora cultural que utiliza la escritura, la narración y el lenguaje audiovisual para contar historias que fortalecen la identidad, la memoria y el patrimonio cultural del territorio.',
 'Valentina Palacio Ascencio es comunicadora social y gestora cultural con cinco años de experiencia en procesos de comunicación, narración y mediación cultural. Ha participado en festivales de cine, medios y proyectos culturales independientes, desarrollando estrategias de comunicación, difusión y curaduría de contenidos. Su trabajo integra la escritura, el lenguaje audiovisual y la narrativa como herramientas para construir relatos que conectan el territorio, la memoria y la identidad cultural desde una mirada contemporánea, acercando a las personas a nuevas formas de comprender y valorar la riqueza cultural del Caribe colombiano.',
 ARRAY[]::text[], 'https://www.instagram.com/valentinapalacio.crea/', '573122475789',
 ARRAY['Narración cultural','Comunicación cultural','Mediación cultural','Escritura creativa','Gestión cultural','Producción audiovisual','Curaduría de contenidos','Storytelling','Patrimonio cultural','Comunicación estratégica'],
 ARRAY[]::text[], true, NOW()),

-- 16. Tayleth Paola Pacheco Cantillo
('hac_taylet01', 'Tayleth Paola Pacheco Cantillo', 'tayleth-pacheco-cantillo',
 '', '',
 'Artesanía', 'Sabanagrande',
 'Artesana especializada en la elaboración de accesorios en mostacilla checa. A través de sus creaciones rescata la riqueza de la cultura indígena, transformando colores y patrones en piezas que cuentan historias.',
 'Tayleth Paola Pacheco Cantillo es artesana con más de diez años de experiencia en la elaboración de collares, pulseras, manillas y aretes en mostacilla checa. Su trabajo está inspirado en la riqueza de las culturas indígenas, donde cada color, figura y patrón tiene un significado especial y representa una forma de conservar la memoria ancestral. A través de sus creaciones busca mantener vivo este legado cultural, convirtiendo cada accesorio en una pieza única que refleja identidad, tradición y el valor del trabajo hecho a mano.',
 ARRAY[]::text[], 'https://www.instagram.com/taypaca/', '573122475789',
 ARRAY['Joyería artesanal','Mostacilla checa','Collares artesanales','Pulseras y manillas','Aretes hechos a mano','Artesanía inspirada en culturas indígenas','Accesorios artesanales','Patrimonio cultural'],
 ARRAY[]::text[], true, NOW()),

-- 17. Javier Enrique Peralta Mendoza
('hac_javie01', 'Javier Enrique Peralta Mendoza', 'javier-peralta-mendoza',
 '', '',
 'Arte Visual', 'Leña',
 'Artista plástico, artesano, compositor y escritor con más de 25 años de trayectoria. A través del arte promueve la creatividad, la enseñanza y la preservación de las expresiones culturales del Caribe colombiano.',
 'Javier Enrique Peralta Mendoza es un artista integral con más de 25 años de experiencia dedicados a la creación, la enseñanza y la promoción del arte y la cultura. Su trabajo abarca las artes plásticas, la artesanía, la música, la escritura y la composición, utilizando cada una de estas expresiones como una herramienta para inspirar, educar y fortalecer la identidad cultural. A través de sus procesos creativos busca acercar a las personas al arte como una experiencia transformadora, promoviendo el talento local y el valor del patrimonio cultural del Caribe colombiano.',
 ARRAY[]::text[], 'https://www.instagram.com/javierenriqueperaltamendoza/', '573122475789',
 ARRAY['Artes plásticas','Artesanía','Composición musical','Escritura creativa','Educación artística','Arte comunitario','Procesos creativos','Gestión cultural','Identidad cultural','Patrimonio cultural'],
 ARRAY[]::text[], true, NOW()),

-- 18. Yuranis Esther Tuirán Arteaga
('hac_yuran01', 'Yuranis Esther Tuirán Arteaga', 'yuranis-tuiran-arteaga',
 '/images/hacedores/yuranis-tuiran-arteaga.jpg',
 '/images/hacedores/yuranis-tuiran-arteaga.jpg',
 'Gastronomía', 'Puerto Colombia',
 'Portadora de saberes tradicionales dedicada a la elaboración de dulces típicos del Caribe y artesanías en cemento, preservando recetas y técnicas que hacen parte de la identidad cultural de su territorio.',
 'Yuranis Esther Tuirán Arteaga es portadora de saberes tradicionales con más de 15 años de experiencia en la elaboración de dulces típicos del Caribe colombiano y la creación de artesanías en cemento. A través de recetas heredadas y preparaciones como el tradicional mongo mongo, el dulce de papaya y otras delicias ancestrales, mantiene viva una parte importante del patrimonio gastronómico de la región. Su trabajo combina creatividad, tradición y dedicación, promoviendo el valor de los sabores locales y de las creaciones hechas a mano como expresiones de la identidad cultural del Caribe.',
 ARRAY[]::text[], '', '573122475789',
 ARRAY['Dulces tradicionales','Gastronomía caribeña','Mongo mongo','Dulce de papaya','Cocina tradicional','Artesanía en cemento','Patrimonio gastronómico','Cultura del Caribe colombiano'],
 ARRAY[]::text[], true, NOW());


-- ================================================================
-- 3. EXPERIENCIAS (5)
-- ================================================================
INSERT INTO experiencias (
  id, title, slug,
  categories, short_description, neighborhood,
  location, meeting_point, duration,
  coordinates, image,
  full_description, includes, what_to_expect, recommendations,
  gallery, is_active, is_featured, created_at
) VALUES

-- 1. Taller de Pintura de Máscaras de Carnaval
('exp_mascar01',
 'Taller de Pintura de Máscaras de Carnaval',
 'taller-pintura-mascaras-carnaval',
 ARRAY['Arte'],
 'Vive una experiencia creativa inspirada en el Carnaval de Barranquilla, donde pintarás tu propia máscara de papel maché mientras descubres el simbolismo de los animales del Caribe y conectas con una de las tradiciones más representativas de nuestra cultura.',
 'Alto Prado',
 'Café ARETÉ',
 'Café ARETÉ – Carrera 50 #80-260, Barranquilla',
 '3 horas',
 '{"lat": 10.9985, "lng": -74.8083}'::jsonb,
 '/images/experience_culture_1772730369365.png',
 'Más que un taller de pintura, esta es una invitación a vivir el Carnaval de Barranquilla desde la creatividad y la tradición. Durante tres horas conocerás el significado de los animales presentes en las máscaras del Carnaval mientras pintas tu propia pieza de papel maché con los colores y símbolos del Caribe. Compartirás un espacio de inspiración, aprendizaje y conexión con otros participantes, llevándote una creación única hecha por ti y un recuerdo inolvidable de nuestra cultura.',
 ARRAY['Máscara de papel maché lista para pintar','Pinturas acrílicas','Pinceles y materiales artísticos','Activación cultural sobre los animales del Carnaval','Espacio de inspiración y narración cultural','Galería colectiva de las obras','Llévate a casa tu propia obra de arte tradicional'],
 ARRAY['Conocer el simbolismo de los animales del Carnaval de Barranquilla','Pintar y personalizar tu propia máscara','Explorar tu creatividad a través del arte','Compartir una experiencia cultural en un ambiente acogedor','Llevarte una obra creada por ti como recuerdo','Conectar con la identidad y el patrimonio del Caribe colombiano'],
 ARRAY['Llega 10 minutos antes del inicio de la experiencia','Usa ropa cómoda','Si lo prefieres puedes traer un delantal','Los refrigerios se solicitan directamente en Café ARETÉ','Ven con disposición para crear y experimentar','No necesitas conocimientos previos de pintura'],
 ARRAY[]::text[], true, true, NOW()),

-- 2. Legado de Matronas: Aprende a atarte un turbante
('exp_turban01',
 'Legado de Matronas: Aprende a atarte un turbante como toda una experta',
 'legado-matronas-turbante',
 ARRAY['Tradición'],
 'Descubre el significado del turbante como símbolo de identidad, resistencia y belleza afrocaribeña. Aprende diferentes formas de usarlo mientras conectas con la historia y los saberes transmitidos por las matronas de nuestra región.',
 'Barranquilla',
 'Por confirmar',
 'Por confirmar',
 '2 horas',
 '{"lat": 10.9667, "lng": -74.8112}'::jsonb,
 '/images/experience_community_1772729851298.png',
 'Vive un encuentro con la tradición afrocaribeña a través del arte de llevar un turbante. En esta experiencia conocerás la historia, el simbolismo y el legado cultural que representa esta práctica ancestral, mientras aprendes diferentes técnicas para usarlo y hacerlo parte de tu identidad. Más que un taller, es un espacio para conectar con la memoria, el autocuidado y la riqueza cultural de nuestras matronas.',
 ARRAY['Introducción al legado cultural de los turbantes','Conversatorio sobre identidad y tradición afrocaribeña','Demostración de diferentes formas de usar turbantes','Acompañamiento durante la práctica','Un turbante para poner en práctica lo aprendido y llevar contigo'],
 ARRAY['Conocer la historia y el significado cultural del turbante','Aprender diferentes técnicas para usarlo','Escuchar relatos y saberes transmitidos por generaciones','Compartir un espacio de aprendizaje e intercambio cultural','Llevarte una nueva forma de conectar con la identidad afrocaribeña'],
 ARRAY['Lleva un espejo de mano o utiliza la cámara de tu celular','Lleva moñas o ganchos para facilitar la práctica','Usa ropa cómoda','Lleva un termo con agua para mantenerte hidratado','Si la actividad es al aire libre utiliza protector solar y sombrilla'],
 ARRAY[]::text[], true, true, NOW()),

-- 3. Dulces con Historia: Legado de Matronas
('exp_dulces01',
 'Dulces con Historia: Legado de Matronas',
 'dulces-con-historia-legado-matronas',
 ARRAY['Gastronomía'],
 'Descubre los sabores que han pasado de generación en generación mientras conoces el legado de las matronas afrocaribeñas. Vive una experiencia gastronómica donde la cocina, las historias y la tradición se unen para preservar la memoria del Caribe.',
 'Barrio Abajo',
 'Por confirmar',
 'Por confirmar',
 '4 horas',
 '{"lat": 10.9956, "lng": -74.8113}'::jsonb,
 '/images/experience_gastronomy_1772729379901.png',
 'Adéntrate en la cocina tradicional del Caribe colombiano junto a una matrona portadora de saberes ancestrales. En esta experiencia conocerás las historias, técnicas e ingredientes que dan vida a los dulces tradicionales afrocolombianos, mientras disfrutas de una demostración en vivo, conversas con su protagonista y descubres por qué cada receta es parte del patrimonio cultural de nuestra región.',
 ARRAY['Recorrido desde el punto de encuentro hasta el espacio de la experiencia','Taller gastronómico en vivo con una matrona tradicional','Narrativas sobre la tradición culinaria afrocaribeña','Demostración de la preparación de dulces tradicionales','Degustación de las preparaciones realizadas','Espacio de conversación e intercambio con la matrona','Encuentro con otros participantes de la experiencia'],
 ARRAY['Conocer la historia y el legado de las matronas del Caribe','Descubrir los secretos de los dulces tradicionales afrocolombianos','Aprender sobre técnicas e ingredientes ancestrales','Conectar con la cultura viva de Barranquilla a través de la gastronomía','Compartir una experiencia auténtica junto a una portadora de tradición'],
 ARRAY['Lleva ropa cómoda y fresca','Lleva un termo con agua','Usa protector solar o sombrilla si es necesario','Llega puntual al punto de encuentro','Ven con disposición para aprender preguntar y disfrutar cada historia y cada sabor'],
 ARRAY[]::text[], true, false, NOW()),

-- 4. Macondo en Barranquilla: Tras las huellas de Gabo
('exp_macond01',
 'Macondo en Barranquilla: Tras las huellas de Gabo',
 'macondo-barranquilla-huellas-gabo',
 ARRAY['Historia','Literatura'],
 'Recorre la Barranquilla que inspiró a Gabriel García Márquez y descubre cómo sus calles, personajes y sabores dieron vida al universo de Macondo. Una experiencia donde la literatura, la memoria y el Caribe se encuentran.',
 'Centro Histórico',
 'Hotel San Nicolas Colonial',
 'Plaza San Nicolás, Barranquilla',
 '3 horas',
 '{"lat": 10.9972, "lng": -74.8049}'::jsonb,
 '/images/experience_historia_1772729674439.png',
 'Déjate llevar por un recorrido que une literatura, historia y cultura para descubrir la Barranquilla que marcó la vida de Gabriel García Márquez. Caminarás por lugares emblemáticos del centro histórico mientras escuchas relatos, disfrutas sabores tradicionales y participas en momentos creativos inspirados en el universo del realismo mágico. Más que una caminata, es una invitación a vivir la ciudad como si cada calle contara una historia.',
 ARRAY['Desayuno costeño','Café de especialidad','Recorrido guiado por el Centro Histórico','Narración y lecturas inspiradas en la obra de Gabriel García Márquez','Kit simbólico de escritura','Souvenir','Registro fotográfico de la experiencia'],
 ARRAY['Descubrir la relación entre Barranquilla y Gabriel García Márquez','Recorrer lugares que hicieron parte de su historia','Escuchar relatos y fragmentos literarios durante el recorrido','Disfrutar los sabores tradicionales del Caribe','Participar en un ejercicio creativo de escritura','Llevarte un recuerdo que conecte con la experiencia vivida'],
 ARRAY['Usa ropa y calzado cómodos para caminar','Lleva agua para mantenerte hidratado','Usa protector solar o sombrero','Llega puntual al punto de encuentro','Trae tu celular o cámara para registrar el recorrido','Ven con disposición para caminar escuchar y dejarte sorprender por las historias de la ciudad'],
 ARRAY[]::text[], true, true, NOW()),

-- 5. Cultura Picotera en las Nieves
('exp_picote01',
 'Cultura Picotera en las Nieves',
 'cultura-picotera-las-nieves',
 ARRAY['Música','Tradición'],
 'Descubre la historia de los icónicos picós, recorre uno de los barrios más tradicionales de Barranquilla y vive una experiencia donde la música, la gastronomía y la cultura popular se unen para contar la identidad del Caribe.',
 'Las Nieves',
 'Barrio Las Nieves',
 'Por confirmar',
 '3 horas',
 '{"lat": 10.9810, "lng": -74.8067}'::jsonb,
 '/images/experience_music_1772729653199.png',
 'Vive una experiencia auténtica recorriendo el barrio Las Nieves, cuna de la cultura picotera en Barranquilla. A través de historias, música en vivo y encuentros con hacedores locales, conocerás el origen de los picós y el papel que han tenido en la vida de los barrios populares. Durante el recorrido disfrutarás de sabores tradicionales, un paseo en carricoche y una demostración práctica para sentir de cerca el ritmo que ha marcado generaciones de barranquilleros.',
 ARRAY['Recorrido cultural guiado por el barrio Las Nieves','Narración sobre la historia de la cultura picotera','Encuentro con hacedores y conocedores locales','Demostración práctica de un picó tradicional','Paseo en carricoche','Degustación de arroz de lisa','Visita a un picó emblemático del barrio','Manilla de recuerdo de la experiencia'],
 ARRAY['Conocer la historia de los picós y las verbenas','Escuchar relatos de quienes mantienen viva esta tradición','Aprender cómo funciona un picó tradicional','Disfrutar una experiencia musical auténtica','Recorrer el barrio Las Nieves desde una mirada cultural','Degustar uno de los platos más representativos de Barranquilla','Conectar con la identidad musical y popular del Caribe'],
 ARRAY['Llega puntual al punto de encuentro','Usa ropa y zapatos cómodos','Lleva protector solar','Trae gorra o sombrilla','Lleva un termo con agua para mantenerte hidratado','Ten tu celular con suficiente batería para registrar la experiencia'],
 ARRAY[]::text[], true, false, NOW());

-- ================================================================
-- Verificación — debe mostrar 18 hacedores y 5 experiencias
-- ================================================================
SELECT 'hacedores' AS tabla, COUNT(*) AS total FROM hacedores
UNION ALL
SELECT 'experiencias', COUNT(*) FROM experiencias;
