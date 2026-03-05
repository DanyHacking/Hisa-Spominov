#!/usr/bin/env python3
"""
Generate PDF for "Hiša spominov – Ko dnevniki spregovorijo"
"""

import os
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.colors import HexColor
import sys

# Register Garamond font (or use built-in)
BOOK_TITLE = "Hiša spominov"
BOOK_SUBTITLE = "Ko dnevniki spregovorijo"

# Colors
TEXT_COLOR = "#2C2C2C"
ACCENT_COLOR = "#8B4513"
NIGHT_BG = "#1a1a1a"
NIGHT_TEXT = "#e0e0e0"

# Page size: 6 x 9 inches
PAGE_WIDTH = 6 * inch
PAGE_HEIGHT = 9 * inch
MARGIN = 0.75 * inch

# Content organized by chapters
def get_chapter_content():
    """Return organized content for the book"""
    
    content = []
    
    # Title Page
    content.append({
        'type': 'title_page',
        'title': BOOK_TITLE,
        'subtitle': BOOK_SUBTITLE
    })
    
    # Predgovor
    content.append({
        'type': 'chapter',
        'title': 'Predgovor',
        'content': '''Dragi bralci,

Pred vami je zgodba, ki ni le pripoved o življenju ene družine, temvež tudi čustveno potovanje, ki vas bo nagovorilo na način, ki ga morda niste pričakovali.

Strani, ki jih boste prebrali, so napolnjene z resničnimi zapisi ljudi, ki so se borili, ljubili, izgubljali in ponovno iskali pot drug k drugemu. To ni zgodba o popolnosti – je zgodba o tem, kako lahko ljubezen, kljub vsem svojim nepopolnostim, preživi.

Ko sem prvič odkril te dnevnike, nisem vedel, da bodo spremenili moje življenje. Zdelo se mi je, da so le naključna zbirka zapisov iz preteklosti, toda ob prvem branju sem začutil globoko povezavo z njihovimi besedami. Te strani niso bile le zapis njihovega življenja – postale so ogledalo, ki je razkrilo tudi moje lastne dvome, sanje in strahove.

To, kar boste prebrali, je resnično. Besede v teh dnevnikih so iskrene, surove in brez filtra. Pripravljajo vas na soočenje z ljubeznijo v vseh njenih odtenkih – od čiste sreče do globoke bolečine.

Ta zgodba je izjemno emocionalno intenzivna in bo v vas prebudila občutke, ki jih morda niste pričakovali.

Priznavam, da ni bilo vedno lahko zapisovati teh zgodb in jih združiti v knjigo. Na trenutke sem se počutil, kot da razkrivam delčke svoje lastne duše, saj sem skozi te zapise videl tudi odsev svojega življenja. Vendar sem prepričan, da je ta zgodba pomembna – ne le za družino, ki jo pripoveduje, temveč za vse nas, ki se trudimo razumeti ljubezen, odnose in sebe.

Berite s sočutjem in odprtim srcem. Morda boste na teh straneh odkrili delček svoje zgodbe. In čeprav je to zgodba drugih, vas vabim, da razmislite, kaj pomeni ljubezen in kako jo negujemo, anche ko je najtežje.

Naj vam te strani prinesejo vpogled, razumevanje in morda celo upanje.

Ta knjiga ni popolna, vendar je iskrena – in v tem se skriva njena največja moč.

S spoštovanjem,
Danijel Cvijetić'''
    })
    
    # Chapter 1: HIŠA, KI HRANI SPOMINE
    content.append({
        'type': 'part',
        'title': 'I. HIŠA, KI HRANI SPOMINE'
    })
    
    content.append({
        'type': 'chapter',
        'title': '1. Stara hiša na robu mesta',
        'content': '''Hiša je stala na obrobju mesta, v senci visokih dreves, katerih krošnje so metale dolge, plešoče sence na razpokano fasado. Na prvi pogled je bila povsem običajna: dvoetažna stavba z belimi stenami, ki so jih zob časa in zanemarjenost spremenili v pomečkan mozaik razpok. Okna so bila temna, zavese zbledele od sonca, kot da se je hiša sama umaknila iz življenja, ki se je nekoč dogajalo znotraj njenih zidov.

Prišel sem sem le zato, ker me je prijatelj povabil, da mu pomagam pri zadnjem čiščenju pred prodajo. Nič ni kazalo na to, da bi ta hiša v meni prebudila karkoli posebnega.

Ko sem stopil skozi težka lesena vrata, ki so zaškripala v tišino, sem bil pripravljen na običajen dan – nekaj ur pospravljanja in nato kava v mestnem baru. Toda nekaj v zraku je bilo drugačno.

Hiša je imela poseben vonj, ki ni bil samo prah ali vlaga, temveč mešanica preteklosti in skrivnosti, ki se je oprijela vsakega kotička.

Ko sem stopil naprej v hodnik, sem pod prsti začutil droben šum drobljenega ometa, ki je popadal z razpokanega stropa. Sobe na desni in levi so bile skoraj prazne, razen nekaj kosov pohištva, ki jih prejšnji najemniki očitno niso potrebovali. Majhna kredenca z razpokanim ogledalom, stara mizica z okrušenim robom – vse je bilo priča nečemu, česar nisem znal ubesediti.

A tisto, kar me je najbolj pritegnilo, je bila tišina. Tišina, ki ni bila običajna, ampak napeta, polna nekega nevidnega bremena, kot da hiša še vedno nosi težo življenj, ki so se odvila v njej.'''
    })
    
    content.append({
        'type': 'chapter',
        'title': '2. Podstrešje',
        'content': '''"Pridi na podstrešje, tam je še nekaj škatel, ki jih nisem odprl," me je poklical prijatelj. Njegov glas je bil oddaljen, kot da ga stene ne pustijo povsem skozi.

Stopnice, ki so vodile na podstrešje, so bile ozke in strme, les pod nogami pa je škripal, kot da me opozarja, naj premislim, preden nadaljujem. A radovednost je bila močnejša.

Ko sem odprl majhna vrata na vrhu stopnic, me je pozdravila gosta plast prahu, ki je lebdel v zrak, ko sem vstopil. Prostor je bil poln starih predmetov – škatel, kovčkov, razrahljanega pohištva, vse skupaj pokrito z odejo pozabe.

Toda ena stvar je takoj pritegnila mojo pozornost. Na desni strani, pod oknom, ki je komaj prepuščalo svetlobo, je bila velika kartonasta škatla. Platnice zvezkov, ki so izstopali iz nje, so bile različnih barv in velikosti. Nekatere so bile tako obrabljene, da so imele vogale zmehčane od časa, druge so bile skoraj nove.

"To je od prejšnjih najemnikov. Našel sem jih, ko sem prvič prišel sem. Meni ne pomenijo nič, a če te zanimajo, jih lahko vzameš," je rekel prijatelj, ko je vstopil za menoj.

Dnevnike sem pobral iz škatle in jih držal v rokah. Bili so težji, kot sem pričakoval – ne zaradi njihove fizične teže, ampak zaradi nečesa nevidnega, kar so nosili. Že ob dotiku sem začutil, da te zvezke ni mogoče preprosto odložiti.

"Si jih bral?" sem vprašal prijatelja.

"Ne. Preveč osebno. Sem jih prelistal, a se mi je zdelo, da bi bil vdor v nekaj, kar ni moje. Pa še… nekako neprijetno je bilo," je odgovoril in skomignil z rameni.

Tistega trenutka sem vedel, da jih moram vzeti. Nisem še razumel, zakaj, a nekaj v meni je klicalo po tem, da odprem prve strani.'''
    })
    
    content.append({
        'type': 'chapter',
        'title': '3. Odločitev',
        'content': '''Ko sem tistega večera prišel domov, sem škatlo položil na mizo. Žena, ki je brala knjigo na kavču, me je opazovala s presenečenjem.

"Kaj si to prinesel?" je vprašala.

"Dnevnike. Našel sem jih v stari hiši, kjer pomaga prijatelj. Menda so od družine, ki je tam živela pred leti," sem odgovoril in previdno odprl prvi zvezek.

Platnica je bila mehka, skoraj usnjena, na vogalih zbledele barve. Pisava na prvi strani je bila natančna in elegantna: "Začelo se je z ljubeznijo, a ljubezen je postala tišina."

Te besede so me ustavile.

Žena je stopila bliže in pogledala čez moje rame.

"To je… močno," je rekla tiho.

Sledil je prvi zapis. Bil je napisan z nežnim, a bolečim tonom, očitno izpod peresa ženske. Pisala je o vsakodnevnih stvareh – o kuhanju večerje, o smehu otrok, o možu, ki je prepozno prišel domov. Toda med vrsticami je bilo nekaj, kar je v meni vzbudilo tesnobo. Pisala je o tišini, ki se je prikradla v njihove pogovore, o trenutkih, ko je občutila, da je nekdo obrnil hrbet, in o tem, kako se je trudila, da bi vse obdržala skupaj.

"Ta ženska… se sliši kot ti," je rekla moja žena in me pogledala z mešanico začudenja in razumevanja.

Njene besede so me pretresle. Ali res? Je to razlog, zakaj sem začutil povezavo že ob prvem dotiku teh zvezkov?'''
    })
    
    # Chapter 2: GLAS MATERE
    content.append({
        'type': 'part',
        'title': 'II. GLAS MATERE'
    })
    
    content.append({
        'type': 'chapter',
        'title': '4. Dnevnik ženske',
        'content': '''Platnica prvega dnevnika je bila preprosta, temno modra, z majhnim zlatim okrasjem na vogalih, ki so se že skoraj povsem obrabili od časa. Obrabljena površina ni bila le dokaz staranja, temveč zgodba sama po sebi – zgodba o prstih, ki so znova in znova iskali uteho med stranmi, kot da bi bile te strani edini kraj, kjer so lahko misli in občutki našli svoj prostor.

Ko sem dnevnik odprl, me je objel vonj starega papirja, prepleten z nečim nevidnim, a globoko čustvenim – kot tih odmev nekega življenja, ujetega med platnice.

Pisava, tekoča in prefinjena, je bila kot ples nežnih, premišljenih gibov. Zdelo se je, da avtorica ni le zapisovala svojih misli, temveč jih je oblikovala v nekaj lepega, anche ko je njeno srce morda krvavelo.

In nato sem prebral prve vrstice.

"21. marec 2016

Danes sem prvič začutla, da ni več tiste ljubezni, k je bla včasih. Mogoče je to ta tišina, k se je počasi pritihotapla, kot en plaz, k na začetku zgleda čist majhen, pol pa rata vedno večji. Ja, pogovarjava se – itak, o otrocih, računih, vremenu. Ampak njegova tišina... drugačna je. Včasih mam občutek, da sm sam še ozadje v njegovem lajfu. Še vedno me objame, še vedno mi reče lahko noč, sam... ni več tiste prave topline v dotiku. Kot da neki manjka."

Ko sem te besede prebral, sem začutil, kako mi je nekaj v grlu zastalo. Zdelo se je, da me te vrstice vlečejo vase, da me skorajda silijo, da jih začutim bolj, kot jih razumem.'''
    })
    
    content.append({
        'type': 'chapter',
        'title': '5. Tišina v zakonu',
        'content': '''Njeno pisanje je bilo kot nežno šepetanje – iskreno in preprosto, a v tej preprostosti je ležala teža celega sveta. Tišina, o kateri je pisala, ni bila le odsotnost zvoka. Bila je tišina med dvema človekoma, ki sta si nekoč delila vse, zdaj pa med njima ostajajo le fragmenti – pogovori o računih, otrocih, vremenu.

Z vsakim stavkom sem čutil njeno hrepenenje, bolečino in obenem tisti drobec upanja, ki ga še ni hotela izpustiti.

Za trenutek sem pogledal ženo, ki je sedela poleg mene. Njene oči so bile uprte v strani, njena roka se je nežno dotaknila moje. Ta droben, tih dotik je povedal več kot tisoč besed. Kot da je želela preveriti, ali sem še vedno tam – ne le fizično, ampak tudi čustveno.

"To je… tako znano," je šepnila. Glas ji je rahlo zadrhtel, njen pogled pa je bil napol žalosten, napol obremenjen s spomini.

Njene besede so me zadele z močjo, ki je nisem pričakoval. Pogoltnil sem in odmaknil pogled nazaj k dnevniku, da bi skril val občutkov, ki so se dvigali v meni.

Tisti trenutek sem se zavedel, da nisem le bral zgodbe neke neznane ženske – bral sem odsev lastnih strahov, dvomov in tistih trenutkov tišine, ki so se tudi med nama prikradli skozi leta.

Njena iskrenost me je prisilila, da sem se soočil z vprašanjem, ki sem se ga bal postaviti: kdaj sem nazadnje začutil toplino v svojem lastnem dotiku?'''
    })
    
    content.append({
        'type': 'chapter',
        'title': '6. Materina ljubezen do otrok',
        'content': '''Ko sem listal dalje, me je vsak njen zapis o otrocih zasidral globlje v njen svet. Njihova imena ni nikoli zapisala – vedno jih je imenovala "moji mali". Te preproste besede so nosile toliko topline in zaščitniškega duha, da sem jih začutil skoraj fizično. A za to nežnostjo so se skrivali sloji skrbi in nemoči, kot bi mati v teh zapisih polagala svoje srce, ki je neprestano trepetalo za svoje otroke.

"Najstarejši je čist po fotru – tih, resen, včasih preveč odgovoren za svoja leta. Vidm ga, kako zvečer pomaga mlajšima bratoma, kot da je že zdaj odrasel. Vedno me pogleda s tistimi očmi, polnimi vprašanj, ki jih ne zna al pa ne upa ubesedit. Mislim, da ga neki žre, sam me je strah vprašat, kaj je. Kaj, če mu ne bom znala pomagat?"

Njene besede so bile prepletene z bolečino – bolečino, ki jo pozna vsak starš, ko vidi otroka, kako prezgodaj odrašča. Najstarejši sin je bil zanjo ogledalo njegovega očeta, tih in vase zaprt. Ta podoba je bila polna občudovanja, vendar tudi strahu. Videla ga je, kako nosi breme, ki je bilo pretežko za njegova leta, in hkrati občutila nemoč, ker ni vedela, kako mu olajšati.

"Srednji... o, moj mali sanjač. Njegov smeh odmeva po bajti, kot da odpira oblake, ko je tema. Vedno ma kakšno zgodbo na zalogi – čarobno, včasih mal žalostno, ampak vedno polno domišljije. Želim si, da bi mu svet pustil sanjat še mal dlje."

Ob teh besedah sem si lahko predstavljal svetlobo, ki jo je srednji sin prinašal v hišo, kljub vsem temnim oblakom, ki so se vlekli nad družino.'''
    })
    
    content.append({
        'type': 'chapter',
        'title': '7. Materina ljubezen do moža',
        'content': '''Vsakodnevni zapisi so pogosto vključili podrobnosti o njenem možu, ki ga je klicala "moj Škorpion". To ime je nosilo pridih skrivnosti, moči, a tudi bolečine. Njen odnos z njim je bil kot tanka nit, napeta med ljubeznijo in osamljenostjo.

"Včasih ga gledam, kako sedi za mizo, pa se sprašujem, kaj mu roji po glavi. Nikol mi ne pove vsega, vedno neki zadrži zase. A je to ljubezen? Al se sam boji pokazat, kako ranljiv je?"

V teh besedah sem začutil, kako zelo ga je poznala, a ga hkrati ni razumela. Njen pogled nanj je bil poln občudovanja, toda tudi obupa. Zaznala je njegovo tiho moč, ki jo je občudovala, a ta moč jo je hkrati oddaljevala od njega.

"Danes mi je rekel, da je utrujen. Vprašala sm ga, če misli utrujen od dela al od mene, pa se je nasmehnil in rekel: 'Od tebe se nikol ne bi mogel utrudit.' Ampak v njegovih očeh sm vidla drugo resnico. Mislim, da je utrujen od življenja, od vsega, kar nosi na svojih ramenih. Pa sm preveč prestrašena, da bi mu rekla, da to vidim."

Ta zapis je bil tako poln bolečine, da se je zdelo, kot da diha iz knjige.'''
    })
    
    content.append({
        'type': 'chapter',
        'title': '8. Prva kriza',
        'content': '''Na eni izmed strani se je ton zapisov nenadoma spremenil. Besede, ki so prej nežno pripovedovale o vsakodnevnem življenju, so postale ostre in polne bolečine. Zdelo se je, kot da se je pero, ki je pisalo z ljubeznijo, zdaj obrnilo in zarezalo naravnost v njeno srce.

"29. september 2017

Danes sva se spet skregala. Pojma nimam več, zakaj točno, sam besede so ble ostre. Rekel mi je, da preveč skrbim, da sem preveč zaščitniška, da morm pustit otroke, da dihajo. To me je zabolel, ker vem, da ma prav. Ampak... a je to res tok narobe? A ni to moj job kot mama, da skrbim zanje? Na konc je šel ven, še preden sem mu lahko karkol odgovorila. Slišala sem, kako so se vrata avta zaloputnila, potem pa je bla hiša spet tiha. Preveč tiha."

Ko sem prebral te vrstice, sem se moral za trenutek ustaviti. Zdelo se je, kot da sem slišal tisto tišino – težko, gosto, skoraj fizično prisotno. To ni bila le tišina, ki sledi prepiru. Bila je tišina, ki se usede med dve duši, ki sta nekoč govorili isti jezik, zdaj pa se ne znata več slišati.

Njene besede so odražale mešanico jeze, razočaranja in krivde.'''
    })
    
    content.append({
        'type': 'chapter',
        'title': '9. Upanje',
        'content': '''Toda kljub bolečini in konfliktom je mati vedno našla način, kako v svoje zapise vnesti drobce upanja. Vsak njen zapis je bil kot nit, ki je držala skupaj vse, kar se je zdelo, da se počasi razpleta.

"20. marec 2018

Vem, da se stvari lahko spremenijo. Včasih, ko otroci zaspijo in sedim z njim na kavču, se spomnim, zakaj sem se sploh zaljubila vanj. Njegove oči, njegov smeh, tista njegova moč – še vedno me privlači. Ampak včasih me je strah, da nisva več ista človeka. Mogoče je to čist normalno. Mogoče ljubezen ni v tem, da ostaneš isti, ampak v tem, da najdeš način, kako rast skupaj."

Njene besede so bile kot žarek svetlobe, ki je prodrla skozi gosto meglo dvomov. Njena sposobnost, da še vedno vidi tisto, kar je nekoč bilo, in da v tem najde moč za prihodnost, je bila ganljiva.

"15. april 2017

'Danes je bil lep dan,' sem rekla, ko je oče prišel domov. 'Je bilo kaj posebnega?' je vprašal in odložil torbo. 'Večerja s trojčki je vedno poseben dogodek,' sem se nasmehnila. Za trenutek sva si izmenjala pogled, poln tistega tihega razumevanja, ki sva ga nekoč delila.'''
    })
    
    # Chapter 3: OČETOV SVET
    content.append({
        'type': 'part',
        'title': "III. OČETOV SVET"
    })
    
    content.append({
        'type': 'chapter',
        'title': '10. Dnevnik očeta',
        'content': '''Ko sem odprl naslednji dnevnik, sem takoj začutil spremembo. Platnica je bila trdna, temno rjava, z globokimi praskami, ki so nakazovale, da je bil pogosto v uporabi – kot da so se besede v njem zapisovale z nevidno silo. Pisava je bila odločna, močna, a v njej je bilo nekaj zlomljenega, tresočega.

Bil je to dnevnik očeta, ki ga je mati v svojih zapisih poimenovala "Škorpion". Ta vzdevek je zdaj dobil novo dimenzijo – skrivnostnost, a tudi ostrino, ki je zarezala tako v tiste okoli njega kot v njegovo lastno dušo.

Očetov glas je bil drugačen – oster, ciničen, vendar poln krhkosti. Njegovi zapisi so bili kot utripajoči svetilniki, ki so osvetljevali notranjo bitko človeka, ki je ljubil, a ni znal pokazati te ljubezni.'''
    })
    
    content.append({
        'type': 'chapter',
        'title': '11. Moški, ki ne zna govoriti o čustvih',
        'content': '''"15. januar 2017

Danes je spet rekla, da me ne šteka. Pa kako za vraga bi me lahko? Vse, kar delam, delam za njo. Za družino. Za nas. Ampak fak, včasih me gleda, kot da sem en jebeni tujec. Sedim zraven nje, otroci šibajo okol, pa namest da bi čutil kakšno toplino, me zadane ta čuden filing, da tle sploh ne pašem več. Kdaj, hudiča, se je to zgodil? Kdaj sem ratal ta tip, k ga niti sam več ne poznam?"

Te besede so bile polne obupa, kot tih krik človeka, ki ljubi, a se hkrati počuti, da je izgubljen v svojem lastnem življenju. Njegov zapis je razkrival človeka, ki je ves čas delal za svojo družino, a se je hkrati počutil vse bolj odtujenega od nje – in od samega sebe.

Bil je oče, ki se je počutil, kot da je zgradil hišo, a nikoli ni našel ključa do nje.'''
    })
    
    content.append({
        'type': 'chapter',
        'title': "12. Očetova jeza",
        'content': '''"28. marec 2017

Njen jebeni pogled me ubija. Tisti njen tih, pasivno-agresivni očitek, ki ga nikol ne reče na glas. Danes je rekla, da sem preveč strog z najstarejšim. Fak, kako naj ji razložim, da ga hočem pripravit na ta zajeban svet, k ga ne bo šparal? Ne morm ga pustit, da živi v nekih iluzijah, da bo vse simpl. Ljubim ga, hudiča, ampak če mu to povem, bo sploh resno jemal karkol rečem? Ljubezen ni v besedah, ampak v tem, kar nardiš. Besede so itak poceni, dejanja štejejo."

Njegova jeza je udarjala s strani kot silovit vihar, toda pod njo je bila ranljivost. Za vsakim ostro izgovorjenim stavkom je bilo čutiti strah – strah, da ne bo dovolj dober oče, da bo njegov sin moral trpeti v življenju, ki ga svet ne bo prizanašal.'''
    })
    
    content.append({
        'type': 'chapter',
        'title': "13. Očetovo obžalovanje",
        'content': '''"10. maj 2017

Danes sem se zadral na srednjega. Razlil je kozarc mleka po prtu. Čist navadna stvar, nič takega, ampak jaz sem čisto popiil. Kričal sem nanj. Njegov obraz... fak, ne morm ga pozabit. Tiste oči, polne strahu in razočaranja. Kot da sem mu zlomil neki, kar mu je pomenl več kot vse na svetu. Ponoč sem šel do njegove sobe, pa sem ga gledal, kako spi. Hotel sem ga zbudit, mu rečt, da mi je žal, ampak nisem imel jajc. Kakšen oče sem, da niti 'oprosti' ne znam rečt?"

Ta zapis me je najbolj zadel. Njegovo obžalovanje je bilo tako surovo, da sem skoraj slišal tiho opravičilo, ki ga nikoli ni izrekel.'''
    })
    
    content.append({
        'type': 'chapter',
        'title': "14. Očetova utrujenost",
        'content': '''"15. november 2018

Včasih mam filing, da me moja lastna familija ne šteka. Cel jeb* dan delam, da jim omogočim boljše življenje, pol pa pridem domov, pa me pričaka sam kaos. Otroci so glasni, vsak bi neki od mene. Ona me pogleda s tistimi očmi, polnimi vprašanj, na katera sploh nimam odgovorov. Vse, kar hočem, je mal miru. Danes sem spet kričal nanje. Nič groznega, sam... v njihovih očih sem videl strah. Fak, sem res ratal tak oče? Tisti, ki se ga bojiš?"

Vsaka beseda v tem zapisu je bila prepojena z utrujenostjo, ki je presegala telesno izčrpanost. Bila je to utrujenost človeka, ki se je izgubil med svojimi lastnimi pričakovanji in realnostjo.'''
    })
    
    # Chapter 4: OTROCI
    content.append({
        'type': 'part',
        'title': "IV. OTROCI"
    })
    
    content.append({
        'type': 'chapter',
        'title': '15. Najstarejši sin',
        'content': '''Platnica njegovega dnevnika je bila skromna, modro-črna, s sledmi otroških rok, ki so puščale neizbrisne madeže vsakodnevnega dotika. Pisava, drobna in še ne povsem utečena, je razkrivala trud, s katerim je vsak zapis nastal.

"12. januar 2017

Danes sem zrihtal sobo. Mami je rekla, da ji to ful pomeni. Pol sem še pazil, da je brat nardil domačo nalogo, ker je bila mami čist zmatrana. Šel sem še v trgovino po kruh. Ko sem prišel nazaj, me je vprašala, če imam sploh kdaj čas za igro. Samo nasmehnil sem se in rekel, da se igram v šoli. Ni bila čist resnica, sam nisem hotu, da bi bla žalostna."

Njegov zapis je bil na videz preprost, a razkrival je globoko čustveno razumevanje.'''
    })
    
    content.append({
        'type': 'chapter',
        'title': '16. Srednji sin',
        'content': '''"15. september 2017

Danes smo šli v park. Mama in oči sta bla čist tiha. Mama je sedela na klopci in brala knjigo, oči pa je neki govoril po telefonu. Mi smo se igrali skrivalnice. Jaz sem se šlo skrit za drevo in gledal mamo. Zgledala je žalostna, čeprav se je trudila, da bi se smejala, ko smo šli nazaj domov. Mislim, da mama velik razmišlja. Oči pa velik govori, sam ne z nami."

Njegov zapis je bil tih opazovalec resnice, ki je bila preveč zapletena za njegov svet sanj.'''
    })
    
    content.append({
        'type': 'chapter',
        'title': '17. Najmlajša hči',
        'content': '''Najmlajša hči je bila stara komaj pet let, ko je začela pisati svoj dnevnik. Njene misli so bile ujete v preprostih, okornih stavkih, ki so jih krasile risbice sončkov, hiš in rož.

"5. december 2017

Danes je bil najboljši dan! Mama mi je spekla palačinke, oči me je dvignil visoko v zrak in rekel, da sem peresce. Srednji brat mi je narisal slona, najstarejši brat pa mi je pomagal zložit moje igrače. Rekla sem mami, da je to moj najljubši dan, in se je smejala. Rekla je, da je to tudi njen najljubši dan."

V tem zapisu je bilo čutiti čisto otroško srečo.'''
    })
    
    content.append({
        'type': 'chapter',
        'title': '18. Otroška osamljenost',
        'content': '''"20. april 2019

Danes sta se mama in oči spet kregala. Šla sem v svojo sobo in risala. Narisala sem sonce, drevesa in nas – našo družino. Ampak nisem vedela, kako narisat nasmehe."

Njene besede so bile preproste, a zarezale so globoko. "Nisem vedela, kako narisat nasmehe." Ta stavek me je zadel kot udarec.

Otroci ne govorijo vedno neposredno o svoji bolečini, toda njihova dejanja – risbe, zgodbe, tišina – kričijo resnico, ki jo odrasli pogosto preslišimo.'''
    })
    
    # Chapter 5: TEMNI ODTENKI
    content.append({
        'type': 'part',
        'title': "V. TEMNI ODTENKI"
    })
    
    content.append({
        'type': 'chapter',
        'title': '19. Prepiri',
        'content': '''"23. februar 2019

Vse se je začelo z enim vprašanjem. Rekla sem mu, zakaj spet dela do pozne ure, on pa je rekel, da je to za družino. Rekla sem mu, da družina rabi več kot denar, in od tam naprej je šlo vse v k*. Kričala sva en na drugega. Otroci so bili vsak v svoji sobi. Najstarejši je prišel dol. Rekel je, naj nehamo. Njegov glas... čist tih, čist odrasel. Fak, to me je ustavilo."

Materine besede so bile polne obžalovanja.'''
    })
    
    content.append({
        'type': 'chapter',
        'title': '20. Razpoke v odnosu',
        'content': '''Hiša, o kateri so govorili dnevniki, je bila polna glasov, toda vsak glas je nosil svojo tišino. Te tišine niso bile običajne – bile so težke, goste, polne neizrečenih misli in čustev.

Dnevniki, ki so jih počasi razkrivale strani, so postajali kot plasti stare barve na stenah, ki jih je bilo treba previdno odstraniti, da bi odkril resnični obraz družine. Toda pod njimi se ni skrivala svetloba, temveč bolečina – plast za plastjo prežeta z napetostjo, ki se je skozi leta vtisnila v njihov vsakdan.'''
    })
    
    content.append({
        'type': 'chapter',
        'title': '21. Materina utrujenost',
        'content': '''"10. januar 2019

Spet sem ga čakala do polnoči. Otroci so že spali, hiša je bla čist tiha, jaz pa sem sedela na kavču z odejo okol ramen. Ko je končno prišel, je bil tiho kot grob. Jaz sem pila čaj, on si je odprl pivo in se usedel na drugi konec kavča. Noben od naju ni rekel niti besede. Mislim, da sva oba čist zmatrana, sam na čisto različne načine. Pogrešam ga. Fak, res ga pogrešam. Ne vem, kdaj sva se tko odmaknila drug od drugega."

Ko sem bral te besede, sem si predstavljal prizor – temna dnevna soba, komaj osvetljena z mehko svetlobo stoječe svetilke.'''
    })
    
    content.append({
        'type': 'chapter',
        'title': '22. Otroci v senci konflikta',
        'content': '''Najstarejši sin: "23. februar 2019

Spet sta se kregala. Poslušal sem ju iz sobe, dokler nisem mislil, da mi bo eksplodirala glava. Pol sem šel dol in jima rekel, naj že neha. Mama me je pogledala s tistimi očmi, čist polnimi solz, in takoj sem začutil krivdo. Kaj pa, če sem jaz razlog, da sta nesrečna?"

Najstarejši sin je v tisti noči izgubil še en delček svoje otroškosti.'''
    })
    
    # Chapter 6: MEJA
    content.append({
        'type': 'part',
        'title': "VI. MEJA"
    })
    
    content.append({
        'type': 'chapter',
        'title': "23. Materin notranji boj",
        'content': '''"15. maj 2019

Včasih me prešine misel, kaj bi bilo, če me en dan enostavno ne bilo več. Ne zato, ker jih ne bi imela rada – bog ve, da jih imam. Ampak... zdi se, kot da me ne potrebujejo več. Oče je močan, otroci so odrasli bolj, kot bi morali. In jaz? Kaj sem jaz? Samo še senca tiste osebe, ki sem bila nekoč.

Ampak pol jih pogledam. Moje male. Ko spijo, tako mirni, tako moji. In si mislim, da jim še vedno lahko dam nekaj. Upanje, mogoče. Nekaj, kar jih bo držalo, ko bo težko. Zaradi tega ostajam."

Njene besede so bile kot preplet dveh svetov – tistega, ki je bil poln dvomov in utrujenosti, ter tistega, ki je bil še vedno prežet z ljubeznijo.'''
    })
    
    content.append({
        'type': 'chapter',
        'title': '24. Ljubezen kot razlog za obstanek',
        'content': '''V tem zapisu se je najgloblje odražalo, kaj jo je držalo pri življenju. Njena ljubezen do otrok je bila nepremagljiva, kljub vsem dvomom, ki jih je čutila do sebe in svojega mesta v družini.

To, kar me je najbolj presenetilo, ni bila njena utrujenost, temveč moč, ki jo je še vedno našla v sebi. Bila je prepričana, da ima še vedno kaj dati – ne popolne rešitve, temveč nekaj tako preprostega in hkrati pomembnega, kot je upanje.

"Zaradi tega ostajam." Ta stavek me je spomnil, kako pogosto ljubezen ne pomeni velike geste ali popolnosti, temveč preprosto odločitev, da ostanemo – kljub vsemu.'''
    })
    
    # Chapter 7: PRVI KORAK NAZAJ
    content.append({
        'type': 'part',
        'title': "VII. PRVI KORAK NAZAJ"
    })
    
    content.append({
        'type': 'chapter',
        'title': "25. Očetov poskus",
        'content': '''"1. junij 2019

Danes sem najstarejšemu rekel, da sem ponosen nanj. Samo to. Pogledal me je, kot da me sploh ne prepozna. Samo rekel je: 'Hvala, oči.' Ampak mislim, da sem po dolgem času spet začutil, da me razume. Mogoče... mogoče se je vseeno nekaj premaknilo."

Ta zapis je bil presenetljivo tih, a nosil je neizmerno težo. Preprost trenutek, ko je oče izgovoril besede, ki jih je dolgo časa zadrževal.'''
    })
    
    content.append({
        'type': 'chapter',
        'title': '26. Majhne spremembe',
        'content': '''Njegov zapis je odražal tako dvom kot upanje. "Mogoče... mogoče se je vseeno nekaj premaknilo." Te besede so bile kot droben žarek svetlobe v njegovem notranjem boju.

V tem zapisu je bilo nekaj univerzalnega – opomin, da včasih ni potrebna velika gesta, temveč le preproste besede, izrečene v pravem trenutku.

Očetova pohvala je bila prvi korak na poti k ponovni povezavi, korak, ki je bil morda za druge neopazen, a zanj ogromen.'''
    })
    
    # Chapter 8: MOJ ODGOVOR NA ZGODBO
    content.append({
        'type': 'part',
        'title': "VIII. MOJ ODGOVOR NA ZGODBO"
    })
    
    content.append({
        'type': 'chapter',
        'title': '27. Branje z ženo',
        'content': '''Dnevniki, ki so bili sprva le skupek starih, prašnih zvezkov v pozabljeni škatli, so postali ključ do preobrazbe, ki je spremenila naju. Strani, polne bolečine, upanja in ljubezni, so odstranjevale sloje oklepa, ki sva ga skozi leta zgradila okoli svojih src.

Ko sva odprla prvi dnevnik, sva mislila, da bova le opazovalca – nevtralna bralca, ki bosta priča življenju druge družine. Toda že po prvih straneh sva ugotovila, da je to nemogoče. Besede matere, očeta in otrok so prebadale najini srci.'''
    })
    
    content.append({
        'type': 'chapter',
        'title': '28. Čustveni zlom',
        'content': '''Nekega večera sem našel svojo ženo na kavču. Dnevnik očeta je držala v naročju, obraz pa je skrivala v dlaneh. Njeno telo se je treslo od solz.

"Ne morem več," je rekla, ko sem se usedel poleg nje. "Ne morem brati teh besed, ne da bi mislila na najina otroka, na naju."

Pogledala me je s pogledom, polnim bolečine, ki je bil hkrati klic po pomoči in tih krik, da je sama ne zmore več.'''
    })
    
    content.append({
        'type': 'chapter',
        'title': '29. Preobrazba',
        'content': '''Dnevniki so postali del najinega vsakdana. Branje ni bilo le opazovanje življenja druge družine; postalo je spoprijemanje z lastnimi bolečinami.

Žena je skozi branje postopoma odkrivala tisto, kar je dolgo zakopavala v sebi.

"Se spomniš, kako sva bila na začetku?" me je vprašala nekega večera. "Kako sva se pogovarjala ure in ure? Kako sva bila vedno prisotna drug za drugega? Kje se je to izgubilo?"

Najina ljubezen je bila vedno tam, a bila je zakopana pod vsakodnevnimi skrbmi, tišinami, ki so postajale vse bolj dolge, in majhnimi spori, ki so pustili brazgotine.'''
    })
    
    content.append({
        'type': 'chapter',
        'title': '30. Gradnja mostov',
        'content': '''Dnevniki so postali most med nama. Po dolgem času sva se začela pogovarjati o stvareh, o katerih prej nisva zmogla – o najinih strahovih, bolečinah in obžalovanjih.

"Misliš, da najini otroci čutijo enako?" me je vprašala žena. "Misliš, da kdaj razmišljajo, da sva preveč zaposlena ali odsotna?"

Vedel sem, da morava nekaj spremeniti.

"Veš, kaj sem ugotovila?" je rekla žena nekega večera. "Da ljubezen nikoli ne izgine. Samo naučiti se moraš, kako jo znova najti."'''
    })
    
    # Chapter 9: HIŠA SPOMINOV
    content.append({
        'type': 'part',
        'title': "IX. HIŠA SPOMINOV"
    })
    
    content.append({
        'type': 'chapter',
        'title': '31. Lekcije dnevnikov',
        'content': '''Dnevniki so razkrivali življenje družine, ki se je borila, ljubila, izgubljala in kljub vsemu vztrajala. Njihova zgodba je bila polna nasprotij – ljubezni in bolečine, povezanosti in osamljenosti, moči in ranljivosti. Toda prav v teh nasprotjih je ležala njihova lepota.

1. Ljubezen je trdoživa

Materini zapisi so bili dokaz, da ljubezen ni vedno glasna ali popolna. Tudi v tišini, konfliktih in utrujenosti je ljubezen preživela.

2. Očetov boj z lastno ranljivostjo

Oče je bil simbol notranjega boja, ki ga mnogi doživljajo, a le redko delijo. Njegovi zapisi so razkrivali moškega, ki je ljubil, a ni znal izraziti svojih čustev.

3. Otroška perspektiva

Otroci so bili srce in duša teh dnevnikov. Njihova preprosta, a globoka razmišljanja so razkrivala, kako napetosti med starši vplivajo nanje.'''
    })
    
    content.append({
        'type': 'chapter',
        'title': '32. Pomen drobnih trenutkov',
        'content': '''Največja lekcija, ki so nama jo dali dnevniki, je bila, kako pomembni so drobni trenutki. Najmlajša hči je v svojih zapisih pogosto omenjala majhne radosti – palačinke, ki jih je spekla mama, očetov topel dotik, risbe, ki jih je delila z brati.

Ti trenutki, čeprav nepomembni na prvi pogled, so bili temelj družine, ki se je borila za svojo povezanost.

To naju je spomnilo, da ni treba iskati velikih gest. Pomembno je, da cenimo drobne stvari, ki tvorijo vsakdan – pogovor ob skodelici čaja, skupni sprehod, trenutek tihega razumevanja.'''
    })
    
    # Chapter 10: SPOROČILO BRALCEM
    content.append({
        'type': 'part',
        'title': "X. SPOROČILO BRALCEM"
    })
    
    content.append({
        'type': 'chapter',
        'title': '33. Ljubite zdaj',
        'content': '''Ko zaprete to knjigo, vas prosim, da za trenutek obstanete. Zaprite oči in si zastavite eno preprosto vprašanje: Koga imate najraje? In kdaj ste mu to nazadnje povedali?

Ljubezen je kot hiša – stara, razpokana, včasih zanemarjena, a vedno polna zgodb. Je kraj, kjer smeh odmeva skozi hodnike in kjer tišina lahko skriva bolečino.

Gradimo jo počasi, z dejanji, toplimi objemi, neizgovorjenimi opravičili in majhnimi gestami, ki jih pogosto ne opazimo.'''
    })
    
    content.append({
        'type': 'chapter',
        'title': '34. Odpuščajte hitro',
        'content': '''Zgodbe, ki sem jih delil z vami, niso bile zgolj zapis o drugi družini. Bile so opomnik na nas same, na to, kako krhka in hkrati neverjetno vztrajna je človeška ljubezen.

Pokazale so, da ljubezen ni brezhibna, da je prežeta z razpokami in sencami, a prav tam – v teh razpokah – se skriva najlepša svetloba.

Dovolite si, da vas te besede prebudijo iz tišine, ki se pogosto prikrade med nas in tiste, ki jih imamo najraje.

Če ste nekoga odrivali stran, zdaj storite korak nazaj.'''
    })
    
    content.append({
        'type': 'chapter',
        'title': '35. Gradite spomine',
        'content': '''Na koncu dneva, ko vse mine – ko dom utihne in življenje steče naprej – ostanejo z nami samo spomini. In ti spomini niso zgrajeni na popolnosti, temveč na trenutkih, ki jih preživimo skupaj: na topli rok, ki so nas podpirale; na glasovih, ki so nam vlivali pogum; na solzah, ki smo jih delili.

Naj vam te strani ostanejo kot opomnik.

Opomnik, da ljubite zdaj. Ne čakajte. Ljubite glasno, četudi vas je strah. Ljubite iskreno, četudi ne veste, kako dolgo bo trajalo.

Kajti ljubezen – anche ko je tiha, anche ko je zakopana globoko pod plastmi bolečine – nikoli zares ne izgine.'''
    })
    
    # Epilog
    content.append({
        'type': 'chapter',
        'title': 'Epilog',
        'content': '''Ko sem zadnjič zaprl škatlo z dnevniki, sem pogledal svojo ženo. Nisem potreboval besed, da bi vedela, kaj mislim. Ni bilo pomembno, ali sva najboljša starša ali popoln par. Pomembno je bilo, da sva tam – drug za drugega in za najine otroke.

Spoznal sem, da ljubezen ni nikoli dokončana. Je nekaj, kar zahteva stalno rast in trud, anche ko je najtežje.

In ravno v tem je bil njihov pomen – pokazali so, kako je ljubezen, čeprav včasih tiha in prekrita z bolečino, vedno močnejša od vsega.

Ostanite zvesti tej ljubezni. In ko boste gledali nazaj, ko boste držali roke tistih, ki jih imate najraje, boste razumeli: ljubezen je tista hiša spominov, ki bo vedno stala.

Morda ne brezhibna, a vedno domača.
Morda ne popolna, a vedno naša.'''
    })
    
    # Zahvale
    content.append({
        'type': 'chapter',
        'title': 'Zahvale',
        'content': '''Hvaležnost je težko ujeti v besede, toda ob koncu te poti čutim neizmerno potrebo, da se zahvalim tistim, ki so prispevali k temu, da je ta knjiga zaživela.

Najprej in predvsem bi se rad zahvalil svoji družini. Vaša podpora je bila moj temelj. Moji ženi, ki je z ljubeznijo in potrpljenjem prenašala moje dolge ure pisanja, brala osnutke in z blagimi besedami: "Morda bi lahko to povedal drugače," pomagala, da sem z vsakim poglavjem rastel.

Najini otroci, ki so s svojimi nasmeji in prisotnostjo prinašali svetlobo v najtemnejše dni, so bili moja tiha inspiracija – opomnik, zakaj so odnosi, ki jih negujemo, tako pomembni.

Posebna zahvala gre mojemu uredniku, ki je iz mojih zmedenih misli ustvaril zgodbo. Njegova strokovnost in vpogledi so bile neprecenljive.

In končno, dragi bralci – vi, ki držite to knjigo v rokah. Hvala, da ste se odločili prebrati te zgodbe, da ste si vzeli čas in stopili v življenje ljudi, katerih čustva in izkušnje so tako zelo človeške.

Upam, da bo ta knjiga v vašem življenju pustila odmev – opomnik, da je ljubezen včasih krhka, a vedno vredna truda.

Hvala.

Iz srca.'''
    })
    
    return content


def create_pdf(filename):
    """Create the PDF book"""
    
    doc = SimpleDocTemplate(
        filename,
        pagesize=(PAGE_WIDTH, PAGE_HEIGHT),
        leftMargin=MARGIN,
        rightMargin=MARGIN,
        topMargin=MARGIN,
        bottomMargin=MARGIN
    )
    
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Title'],
        fontSize=32,
        spaceAfter=30,
        textColor=HexColor(ACCENT_COLOR),
        alignment=TA_CENTER
    )
    
    subtitle_style = ParagraphStyle(
        'CustomSubtitle',
        parent=styles['Title'],
        fontSize=20,
        spaceAfter=50,
        textColor=HexColor(TEXT_COLOR),
        alignment=TA_CENTER
    )
    
    part_style = ParagraphStyle(
        'PartTitle',
        parent=styles['Heading1'],
        fontSize=18,
        spaceBefore=40,
        spaceAfter=30,
        textColor=HexColor(ACCENT_COLOR),
        alignment=TA_CENTER
    )
    
    chapter_style = ParagraphStyle(
        'ChapterTitle',
        parent=styles['Heading1'],
        fontSize=16,
        spaceBefore=30,
        spaceAfter=20,
        textColor=HexColor(ACCENT_COLOR),
        alignment=TA_LEFT
    )
    
    body_style = ParagraphStyle(
        'BodyText',
        parent=styles['BodyText'],
        fontSize=11,
        alignment=TA_JUSTIFY,
        spaceAfter=15,
        textColor=HexColor(TEXT_COLOR),
        lineSpacingFactor=1.4
    )
    
    predgovor_style = ParagraphStyle(
        'Predgovor',
        parent=styles['BodyText'],
        fontSize=11,
        alignment=TA_JUSTIFY,
        spaceAfter=15,
        textColor=HexColor(TEXT_COLOR),
        lineSpacingFactor=1.4,
        firstLineIndent=30
    )
    
    story_style = ParagraphStyle(
        'StoryText',
        parent=styles['BodyText'],
        fontSize=11,
        alignment=TA_JUSTIFY,
        spaceAfter=15,
        textColor=HexColor(TEXT_COLOR),
        lineSpacingFactor=1.4,
        firstLineIndent=0
    )
    
    # Build story
    story = []
    content = get_chapter_content()
    
    for item in content:
        if item['type'] == 'title_page':
            story.append(Spacer(1, 2*inch))
            story.append(Paragraph(item['title'], title_style))
            story.append(Spacer(1, 0.3*inch))
            story.append(Paragraph(item['subtitle'], subtitle_style))
            story.append(PageBreak())
            
        elif item['type'] == 'part':
            story.append(PageBreak())
            story.append(Paragraph(item['title'], part_style))
            story.append(Spacer(1, 0.2*inch))
            
        elif item['type'] == 'chapter':
            story.append(Paragraph(item['title'], chapter_style))
            
            # Use different style for Predgovor (first paragraph indent)
            if item['title'] == 'Predgovor' or item['title'] == 'Zahvale':
                story.append(Paragraph(item['content'].replace('\n\n', '<br/><br/>'), predgovor_style))
            else:
                # Split content into paragraphs
                paragraphs = item['content'].split('\n\n')
                for para in paragraphs:
                    if para.strip():
                        story.append(Paragraph(para.replace('\n', '<br/>'), story_style))
            
            story.append(Spacer(1, 0.3*inch))
    
    # Build PDF
    doc.build(story)
    print(f"PDF created: {filename}")


if __name__ == '__main__':
    output_path = '/workspace/knjiga-flipbook/pdf/hisa_spominov_del1.pdf'
    create_pdf(output_path)
