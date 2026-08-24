-- Seed për Shpend Januzi Hair Studio (idempotent)
INSERT INTO services (slug, name, description, category, price, duration, sort_order, active) VALUES
  ('prerje-klasike', 'Prerje Klasike', 'Konsultim, prerje me gershere, larje dhe stilim me produkte profesionale.', 'Prerje', 7, 45, 1, true),
  ('skin-fade', 'Skin Fade', 'Kalim i paster nga zero, kontur i sakte me brisk dhe finish me pomade mat.', 'Prerje', 9, 45, 2, true),
  ('prerje-mjekerr', 'Prerje + Mjekerr', 'Kombinimi i plote: prerje e personalizuar dhe konturim mjekre me vijeza.', 'Kombinime', 12, 60, 3, true),
  ('kontur-mjekre', 'Kontur Mjekre', 'Vijezim me brisk, vaj dhe balsam qetesues pas rruajtjes.', 'Mjekerr', 5, 30, 4, true),
  ('hot-towel-shave', 'Royal Hot Towel Shave', 'Rruajtje tradicionale me peshqir te nxehet, avull, shkume dhe brisk te ri.', 'Mjekerr', 10, 45, 5, true),
  ('prerje-femijesh', 'Prerje Femijesh', 'Per femije deri ne 12 vjec - shpejt, me durim dhe me shume humor.', 'Prerje', 5, 30, 6, true),
  ('camouflage', 'Camouflage thinjash', 'Ngjyrosje natyrale e thinjave me pigment qe zbehet gradualisht.', 'Ekstra', 8, 30, 7, true),
  ('hair-tattoo', 'Hair Tattoo / Dizajn', 'Vija, motive dhe dizajne te gdhendura me makine - sipas fotos qe sjell.', 'Ekstra', 6, 30, 8, true),
  ('larje-stilim', 'Larje & Stilim', 'Larje me shampon profesional, masazh koke dhe stilim per mbrëmje.', 'Ekstra', 4, 20, 9, true)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO barbers (slug, name, role, bio, avatar_url, specialties, sort_order, active) VALUES
  ('shpend-januzi', 'Shpend Januzi', 'Themelues & Master Barber', '12 vite pas karriges. Specialitet i tij jane fade-t e pastra dhe vijezimet me brisk.', 'https://images.pexels.com/photos/8468137/pexels-photo-8468137.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=800', 'Skin Fade, Scissor Work, Hot Towel Shave', 1, true),
  ('ardit-k', 'Ardit K.', 'Senior Barber', 'Mjeshter i mjekres dhe i rruajtjes tradicionale. Qetesia e studios ne duart e tij.', 'https://images.pexels.com/photos/8468140/pexels-photo-8468140.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=800', 'Mjekerr, Klasike, Camouflage', 2, true),
  ('liridon-b', 'Liridon B.', 'Barber & Dizajner', 'Ben hair tattoo dhe dizajne qe i shohin te gjithe. I shpejte, i sakte, gjithmone me muzike.', 'https://images.pexels.com/photos/8468132/pexels-photo-8468132.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=800', 'Hair Tattoo, Fade, Prerje Femijesh', 3, true)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO reviews (author, rating, body, service, approved)
SELECT * FROM (VALUES
  ('Endrit M.', 5, 'Fade-i me i paster qe kam marre ne Lipjan. Rezervova online dhe nuk prita as nje minute.', 'Skin Fade', true),
  ('Bleron K.', 5, 'Shpendi e di saktesisht cfare te ben pa pyetur shume. Klient prej 6 vitesh.', 'Prerje Klasike', true),
  ('Valmir S.', 5, 'Hot towel shave eshte pervoje me vete. Doli fytyra si e bebes.', 'Royal Hot Towel Shave', true),
  ('Dardan H.', 5, 'E ceva djalin 7 vjec, e trajtuan si mbret. Tani kerkon vetem Liridonin.', 'Prerje Femijesh', true),
  ('Arian T.', 4, 'Pune shume e mire, vetem te shtunave behet pak crowded - rezervoni heret.', 'Prerje + Mjekerr', true),
  ('Faton R.', 5, 'Atmosfere, muzike, kafe dhe prerje perfekte. Cfare tjeter te kerkosh?', 'Prerje + Mjekerr', true)
) AS seed(author, rating, body, service, approved)
WHERE NOT EXISTS (SELECT 1 FROM reviews);
