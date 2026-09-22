import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const ocrText = `JDBC601 Abhijeet Ravindra Gaikwad argaikwad24@gmail.com RIT 7745877951 CSIT
JDBC602 Aaliya Javed Nadaf aaliyanadaf5@gmail.com DYP 8483805274 Computer Science and Data Science
JDBC603 Aditi Arun Sayagaon aditisayagaon@gmail.com DKTE 9322354355 CSE
JDBC604 Amruta Shashikant Powar amrutapowar2103@gmail.com DKTE 7588456484 CSE-AIML 
JDBC605 Anjali Bhandare anjalibhandare27@gmail.com KIT 7420831843 CSBS
JDBC606 Anjali Vijay Sonalkar anjalisonalkar1@gmail.com DKTE 9404267373 ETC
JDBC607 Anuja Vijay Herwade anujaherwade31@gmail.com DKTE 9561847191 AIDS
JDBC608 Anuradha Dhondiba Mudhale anuradhamudhale314@gmail.com DKTE 8275677225 CSE(AIML)
JDBC609 Apurva Krushna Kumbhar apurvakumbhar097@gmail.com DKTE 7248907436 CSE AIML
JDBC610 Apurva Rajiv Shinde shindeapurva84@gmail.com DKTE 8177883514 AI-DS
JDBC611 Arya Bharat Patil aryapatil2075@gmail.com DKTE 9860553750 CSE-AIML
JDBC612 Arya Vikram Patil Kurle aaryapatilkurle2006@gmail.com RIT 9699652050 CSIT
JDBC613 Ashwini Krishnat Genge ashwinigenge0@gmail.com KIT 9561902103 Computer Science and Engineering
JDBC614 Astha Mangesh Polas asthapolas@gmail.com KIT 7083589809 CSE-AIML
JDBC615 Atharv Sadanand Koli atharvkoli47@gmail.com DKTE 9359756252 CSE(AIML)
JDBC616 Dipa Sanjay Kumbhar dipakumbhar01@gmail.com KIT 8767904594 CSBS
JDBC617 Divya Kuber Magdum divyamagdum9@gmail.com DKTE 8459797191 AI-DS
JDBC618 Divyangini Rajendra Pargave divyanginipargave@gmail.com DKTE 9699850198 AIDS
JDBC619 Gouri Eknath Patil gourieknathpatil372@gmail.com KIT 8623062163 Computer Science and Business System
JDBC620 Harsh Sangram Desai harshsdesai2222@gmail.com KIT 7840901815 CSE-AIML
JDBC621 Harshada Jivandhar Keste kesteharshada87@gmail.com DKTE 8888255108 CSE(AIML)
JDBC622 Harshada Santoshkumar Suhase harshadasuhase2005@gmail.com DKTE 8485065591 AI-DS
JDBC623 Harshvardhan Santosh Gurav harshvardhangurav2005@gmail.com DKTE 8087297874 AIML
JDBC624 Isha Rajendra Marathe ishamarathe0510@gmail.com DKTE 8668388112 CSE
JDBC625 Janhavi Dilip Jagadale Janhavijagadale295@gmail.com KIT 9403583661 Computer Science and Business System 
JDBC626 JANHAVI PATIL pjanhavi2910@gmail.com DKTE 8208213649 Electronics and Telecommunication
JDBC627 Janhavi Sunil Nazare nazarejanhavi5@gmail.com DKTE 7757901807 AI-DS
JDBC628 Jogeshwari Laxman Miraje jogeshwarimiraje33@gmail.com KIT 9119426156 AIML
JDBC629 Karande Tejshree Ramesh tejshreekarande23@gmail.com DKTE 9730916264 CSE-AIML
JDBC630 Komal Sabarad ksabarad09@gmail.com KIT 9423585925 CSE(AIML)
JDBC631 Mane Sarthak Janardhan sarthakmane475@gmail.com DKTE 9975529699 AI&DS
JDBC632 Mrudula Rajendra Waghmode mrudulawaghmode11@gmail.com DKTE 8055793517 CSE (AIML)
JDBC633 Neha Rajgonda Patil patilneha0518@gmail.com DKTE 9834846442 CSE(AIML)
JDBC634 Nilofar Asif Nadaf nadafnilofar95@gmail.com DKTE 9309749913 CSE
JDBC635 Nikhil Sachin Gosavi nikhilgosavi0201@gmail.com KIT 9923504245 AIML
JDBC636 Pawadi Piragond Kanal kanalpawadi@gmail.com DKTE 9096734431 AIDS
JDBC637 Prajwal Anand Sonandkar prajwalsonandkar35@gmail.com DKTE 8080211722 ENTC
JDBC638 Pranali Vishwas Salunkhe pranalisalunkhe171@gmail.com DKTE 9380675971 CSE
JDBC639 Pranali Yuvraj Charapale pranalicharapale0675@gmail.com DKTE 7385820675 E&TC
JDBC640 Pranjal Sanjay Dudhal dudhalpranjal04@gmail.com DKTE 7620942673 Electronics and Telecommunication
JDBC641 Pranjali Dhanaji Jamadade pranjalijamadade07@gmail.com KIT 6364377713 Computer Science and Business Systems
JDBC642 Pranoti Pravin Sankpal pranotisankpal76@gmail.com DKTE 9322661904 CSE
JDBC643 Prasad Babaso Londhe londheprasad75@gmail.com DKTE 9284874203 CSE(AIML)
JDBC644 Pratiksha Parasharam Motar pratikshamotar12@gmail.com KIT 9146711059 Computer Science and Business System 
JDBC645 Pratiksha Rajendra Mali malipratiksha1130@gmail.com KIT 8180811144 Computer Science and Business System
JDBC646 Radhika Ramesh Sutar sutarradha11@gmail.com DKTE 7972334751 CSE
JDBC647 Rahul Javahar Chavan rahuljavaharchavan13@gmail.com DKTE 7219528651 Artificial Intelligence and Data Science
JDBC648 Runali Rajendra Ramdurge runaliramdurge2005@gmail.com DKTE 9359970080 CSE
JDBC649 Rushabh Ravasaheb Zore rushabhzore@gmail.com WCE 9284438003 Computer Science and Engineering
JDBC650 Rutuja Suhas Puranik rutujapuranik7@gmail.com DKTE 9404617583 CSE-AIML
JDBC651 Ruturaj Jalindar Divate ruturajdivate09@gmail.com RIT 9881188157 CSIT
JDBC652 Sai Dnyaneshwar More moresai0073@gmail.com KIT 9156578252 AIML
JDBC653 Sakshi Suryakant Gadade sakshigadade531@gmail.com KIT 7385654380 CSBS
JDBC654 Samruddhi Mahesh Shingade samruddhishingade02@gmail.com DKTE 8999105495 CSE(AIML)
JDBC655 Saniya Aslam Shaikh saniya.aslam1155@gmail.com DKTE 9322655004 ENTC
JDBC656 Saniya Dinakar Gharal saniyagharal09@gmail.com KIT 7796519301 Computer Science and Business System
JDBC657 Sanika Sudhakar Tavate tavatesanika587@gmail.com DKTE 9529008495 Computer Science (AIML)
JDBC658 Sanjivanee santosh todakar sanjivanee244@gmail.com DKTE 8208101532 AI DS
JDBC659 Sanskruti Sudarshan Mane sanskrutimane9480@gmail.com DKTE 9511214863 Computer Science and Engineering
JDBC660 Sanskar Sanjay Rangole rangole591@gmail.com KIT 7620372024 Computer Science and Business System
JDBC661 Satish Maruti Mali malisatish2005@gmail.com RIT 9322504144 CS-IT
JDBC662 Sayali Santosh Shinde saylishinde2704@gmail.com KIT 7020673602 Computer Science and Business System
JDBC663 Shital Sanjay Jadhav shitaljadhav3080@gmail.com DKTE 9860857551 ETC
JDBC664 Shivraj Basavraj Sapali shivslens@gmail.com SIT 8310043388 Computer Science Engineering
JDBC665 Shivtej Anandrao Pawar shivtejapawar5@gmail.com DKTE 8379877031 Artificial Intelligence and Data Science
JDBC666 Shraddha Gopal Patil shraddhapatil2005sp@gmail.com KIT 8668799134 AIML
JDBC667 Shraddha Sachin Khot khotshraddha27@gmail.com DKTE 8180805473 CSE AIML
JDBC668 Shreyash Sunil Gavade shreyashgavade7@gmail.com DKTE 9356997428 AIDS
JDBC669 Shriram Sunil Pawal shrirampawalarmy@gmail.com RIT 8329348715 ENTC
JDBC670 Shruti Dattatray Salunkhe shrutisalunkhe47@gmail.com DKTE 8381814004 CSE
JDBC671 Shubham Sanjay Shewalkar shubhamshewalkar14@gmail.com RIT 9067929308 CSIT
JDBC672 Shweta Rajaram Shinde shwetashinde5107@gmail.com KIT 9699927118 Computer Science and Engineering
JDBC673 Shweta Ravindra Khatavkar shwetakhatavkar.2811@gmail.com KIT 7030882811 Computer Science-AIML
JDBC674 Siddhi Dhananjay Danekar danekarsiddhi@gmail.com DKTE 7385697243 AI-DS
JDBC675 Siddhi Maruti Khot siddhikhot68@gmail.com KIT 8446451159 CSBS
JDBC676 Siddhi Vijay Padalkar siddhipadalkar216@gmail.com DKTE 9175106717 AIDS
JDBC677 Siya Yaranalkar siyayaranalkar@gmail.com KIT 8668374297 CSBS
JDBC678 Sonali Krushnat Karade sonalikarade50@gmail.com DKTE 9689446650 Computer Science and Engineering
JDBC679 Srushti Avadhut Kamble srushtik704@gmail.com DKTE 8080779422 CSE (AI-ML)
JDBC680 Suhana Riyaj Shikalgar suhanashikalgar2@gmail.com DKTE 9529366996 AIML
JDBC681 Swaroopa Shailesh Payashetti payashettyswaroopa@gmail.com DKTE 9823683123 AIDS
JDBC682 Tanish Someshwar Y tanishkokane2006@gmail.com RIT 7666008159 Information Technology
JDBC683 Tasalima Gulab Jamadar tasalimaj2504@gmail.com DKTE 9284514898 AIML
JDBC684 Tejas Dipak Karpe tejaskarpe06@gmail.com KIT 7558417704 CSE-AIML
JDBC685 Tejas Sanjay Chougule chouguletejas7@gmail.com DKTE 9322005536 AI & DS
JDBC686 Tejas Vinit Buwa tejasbuwa@gmail.com KIT 9834874931 CSE(AIML)
JDBC687 Trupti Rajgonda Zore zoretrupti08@gmail.com DKTE 7020996244 AIML
JDBC688 Vaishnavi Balaso Shintre vaishnavishintre5493@gmail.com DKTE 9960450504 CSE AIML
JDBC689 Vaishnavi Sachidanand Pise vaishnavipise3792@gmail.com KIT 9168219219 Artificial Intelligence and Machine Learning
JDBC690 Vaishnavi Shailesh Kelkar vaishnavikelkar05@gmail.com KIT 8180907632 AIML
JDBC691 Vedika Krushnat Kotekar vedikakotekar@gmail.com KIT 7447382212 CSE
JDBC692 Yash Mahaveer Vasagadekar vasagadekary@gmail.com DKTE 8080375903 CSE
JDBC693 Yogiraj Kulkarni yogiraj012007@gmail.com KIT 8087931555 CSBS
JDBC694 Anusha Anil Raybagi anusharaybagi@gmail.com DKTE 9226045413 CSE(AIML)
JDBC695 Pranali Pradeep Khade pranalipkhade@gmail.com KIT 9699909623 CSBS
JDBC696 Mustkeem Sameer Shaikh mustakeemshaikh946@gmail.com TKIET 9022886140 CSE
JDBC697 Dhanashri Vijay Powar dhanashripowar04@gmail.com DKTE 8552049859 ENTC
JDBC698 Anagha Suresh Patil patilanagha2601@gmail.com DKTE 8626038385 ENTC
JDBC699 Rutuja Prakash Shinde shinderutu.2426@gmail.com TKIET 7385711424 CSE
JDBC6100 Anuradha Bandu Sonawane anuradhasonawane1399@gmail.com TKIET 9699663393 CSE
JDBC6101 Sanika Maruti Gavkar gavkarsanika37@gmail.com TKIET 9359402324 CSE
JDBC6102 Paurnima Ananda Shirsat shirsatpaurnima@gmail.com TKIET 7020041733 CSE
JDBC6103 Prithviraj Shamrao Patil patilprithviraj456@gmail.com TKIET 9307406892 CSE
JDBC6104 Shravani Shrikant Nalawade shrav0321@gmail.com TKIET 9561735512 CSE
JDBC6105 Vaishnavi Shivaji Patil vaish4643@gmail.com TKIET 9623041885 CSE
JDBC6106 Shravan Sambhaji Kapare shravankapare2004@gmail.com TKIET 9970201267 CSE
JDBC6107 Shreya Rajendra Lambe shreyalambe05@gmail.com TKIET 8856989939 CSE
JDBC6108 Anushka Uttam Gaikwad anushkagaikwad702858@gmail.com TKIET 8468884202 CSE
JDBC6109 Vaishnavi Vinod Kamble kamblevaishnavi8521@gmail.com TKIET 7249050081 CSE
JDBC6110 Sanika Bajirao Tambavekar sanikatambavekar@gmail.com TKIET 8010728014 CSE
JDBC6111 Surbhi Dattatray Mane surbhimane447@gmail.com TKIET 9309406552 CSE
JDBC6112 Payal Vijaykumar Gavali gavalipayal266@gmail.com TKIET 8262822282 CSE
JDBC6113 Sharvari Rajendra Patil sharvaripatil2530@gmail.com TKIET 8080903183 CSE
JDBC6114 Tanvi Satish Patil tanvipatil242005@gmail.com TKIET 8329085474 CSE
JDBC6115 Kartik Vijay Desai kartikdesai059@gmail.com TKIET 8975893743 CSE
JDBC6116 Umssh Mahesh Bhatkar umbhatkar@gmail.com Finolex Academy 8010015947 CSE (AI & ML)
JDBC6117 Sanika Rajaram Ghodake sanughodake16june@gmail.com TKIET 9021083237 Computer Science and Engineering
JDBC6118 Swara Pramod Desai desaiswara831@gmail.com Finolex Academy 8010593600 Computer Science Engineering (AI & ML)
JDBC6119 Sakshi Padmakar Niture sakshiniture63@gmail.com TKIET 9689952541 CSE
JDBC6120 Madhura Manohar Mohite Madhuramohite6365@gmail.com TKIET 7276709425 CSE
JDBC6121 Samiksha Sushant Shelar samikshashelar078@gmail.com Finolex Academy 7448205405 MCA
JDBC6122 Paramita Manindranath Roy royparamita990@gmail.com Finolex Academy 9130564301 CSE (AI & ML)
JDBC6123 Saniya Anil Jadhav jadhavsaniya2905@gmail.com Finolex Academy 9322955820 CSE (AI & ML)
JDBC6124 Dipti Dasharath Morajkar diptimorajkar2005@gmail.com Finolex Academy 7498110516 CSE (AI-ML)
JDBC6125 Sanika Kamalakant Parab leeshaparab1922@gmail.com Finolex Academy 9561990246 Computer Science Engineering (AI & ML)
JDBC6126 Shruti Santosh Shinde shindeshruti0105@gmail.com Finolex Academy 7588279587 CSE (AI & ML)
JDBC6127 Arya Naresh Akhade aryaakhade2005@gmail.com Finolex Academy 8308409900 Information Technology 
JDBC6128 Tanmay Rakesh Kamble tanmaykamble106@gmail.com Finolex Academy 8600801364 Information Technology
JDBC6129 Karan Kashinath Patil Karanpatil8077@gmail.com TKIET 9860106517 Computer Science and Engineering
JDBC6130 Ayush Santosh Raut ayushraut152@gmail.com TKIET 8552806615 CSE
JDBC6131 Sujal Pandurang Dambe sujaldambe2004@gmail.com TKIET 9022817657 Computer Science and Engineering
JDBC6132 Harsha Vinod Hajare harshavinod1818@gmail.com KIT 9172321830 CSBS
JDBC6133 Smruti Satish Hanje smrutihanje11@gmail.com TKIET 9370729904 CSE
JDBC6134 Iqra Iqbal Kotawdekar iqrakotawdekar2206@gmail.com Finolex Academy 9405310987 CSE (AI & ML)
JDBC6135 Kunal Harshad Patil kkunalhpatil.8670@gmail.com TKIET 9561654456 CSE
JDBC6136 Shivam Manoj Phalke shivamp0075@gmail.com TKIET 7414907510 CSE
JDBC6137 Nandini Ashok Chiplunkar nandinichiplunkar2021@gmail.com Finolex Academy 8208369960 MCA
JDBC6138 Heena Saipan Baluragi heenabalurgi@gmail.com Finolex Academy 9175721044 MCA
JDBC6139 Faisal Sakware sakwarefaisal@gmail.com Finolex Academy 9552620954 CSE (AI & ML)
JDBC6140 Pratik Banda Magdum pratikmagdum0202@gmail.com TKIT 9767020273 CSE
JDBC6141 Vishwajit Ananda Disale vishwajitdisale15@gmail.com Finolex Academy 9307742424 Computer Science and Engineering
JDBC6142 Anuja Ravindra Dharane anujadharane9@gmail.com Finolex Academy 9322383559 Information Technology
JDBC6143 Samruddhi Shivaji Janwalkar janwalkarsamruddhi@gmail.com Finolex Academy 9322983109 Information Technology
JDBC6144 Siddhi Dipak Juvatkar juvatkarsiddhi00@gmail.com Finolex Academy 7385453654 Information Technology
JDBC6145 Isha Prakash Kale ishapkale3@gmail.com Finolex Academy 9823575339 CSE (AI & ML)
JDBC6146 Om Satappa Nakate omnakate07@gmail.com Finolex Academy 7666624142 Computer Science and Engineering
JDBC6147 Aditya Dasharath Naik adityadnaik64@gmail.com Finolex Academy 9420469295 CSE (AI & ML)
JDBC6148 Vedika Sadanand Pomendkar vedikapomendkar@gmail.com Finolex Academy 9561282126 MCA
JDBC6149 Shivprasad Uday Sutar shivsutar8555@gmail.com Finolex Academy 7666361311 Computer Science and Engineering
JDBC6150 Shreya Rajendra Pavaskar shreyapavaskar06@gmail.com Finolex Academy 7972689029 CSE (AI & ML)
JDBC6151 Vaidehi Sunil Talekar tvaidehi305@gmail.com Finolex Academy 7350702277 B.E. Information Technology
JDBC6152 Soham Suhas Joshi sohamj346@gmail.com Finolex Academy 8421049659 MCA
JDBC6153 Sakshi Salunkhe sakshisalunkhe2904@gmail.com TKIET 8237925009 CSE
JDBC6154 Rajvardhan Bharat Shete rajvardhanshete29@gmail.com TKIET 9067711914 CSE
JDBC6155 Khadija Hanif Chaus khadijachaus25@gmail.com Finolex Academy 9922239759 CSE-AIML
JDBC6156 Esha Ravindra Damle damleresha@gmail.com Finolex Academy 7758063543 MCA
JDBC6157 Srushti Deepak Jadhav srushtijadhav1485@gmail.com Finolex Academy 9322807634 IT
JDBC6158 Diksha Sharad Salvi dikshasalvi2004@gmail.com Finolex Academy 9404568075 MCA
JDBC6159 Sharvari Sudhir Marathe sharvarimarathe15@gmail.com Finolex Academy 7276683997 Information Technology
JDBC6160 Krutika Ashok Patil krutikapatil1122@gmail.com TKIET 9284818255 CSE
JDBC6161 Shivani Sachin Nimbalkar nimbalkarshivani560@gmail.com TKIET 8999513215 CSE
JDBC6162 Shraddha Gajanan Wagh shraddhawagh705@gmail.com TKIET 8149246623 Computer Science and Engineering
JDBC6163 Arya Kamalakar Kharde aaryakharde24@gmail.com Finolex Academy 7028634856 Information Technology
JDBC6164 Prathmesh Pramod Gadgil prathameshgadgil660@gmail.com Finolex Academy 9359385476 Information Technology
JDBC6165 Anushka Sandip Dhumal anushkadhumal27@gmail.com 8605962577 Yashoda CSE
JDBC6166 Omkar Ashok Jadhav omjadhav200519@gmail.com 8080423927 Tkiet CSBS
JDBC6167 Aarti Deepak Jadhav jadhavaarti3145@gmail.com 7666873545 Yashoda Technical Campus Computer Science and Engineering
JDBC6168 Komal Suresh Valekar komalvalekar123@gmail.com 9359247249 Yashoda Computer Science and Engineering
JDBC6169 Pranali Sayaji Narale 23177pranalinarale@gmail.com 8329279338 TKIET Computer Science and Engineering
JDBC6170 Bhakti Vishwas Patil bp2241056@gmail.com 9934357878 TKIET Computer Science and Engineering
JDBC6171 Devyani Manik Patil patildevyani4899@gmail.com 7498262565 TKIET Computer Science and Engineering
JDBC6172 Pritam Patil pritam7096p@gmail.com 7420847096 TKIET Computer Science and Engineering
JDBC6173 Samruddhi Jambhale jambhalesamruddhi5@gmail.com 9322973971 TKIET Computer Science and Engineering`;

async function main() {
  const lines = ocrText.split('\n');
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  
  let batch = await prisma.batch.findUnique({ where: { name: 'JDBC-06' }});
  if (!batch) {
     batch = await prisma.batch.create({ data: { name: 'JDBC-06', status: 'Active' } });
  }
  const batchId = batch.id;

  let created = 0;
  for (const line of lines) {
    if (!line.trim()) continue;
    
    const emailMatch = line.match(emailRegex);
    if (!emailMatch) continue;
    
    const email = emailMatch[0].toLowerCase();
    const emailIndex = line.indexOf(emailMatch[0]);
    let beforeEmail = line.substring(0, emailIndex).trim();
    
    let rollNumber = "";
    let name = beforeEmail;
    
    const parts = beforeEmail.split(/\s+/);
    if (parts.length > 1) {
       rollNumber = parts[0];
       name = parts.slice(1).join(" ");
    }
    
    const afterEmail = line.substring(emailIndex + email.length).trim();
    let collegeName = "";
    const mobileMatch = afterEmail.match(/\b\d{10}\b/);
    if (mobileMatch) {
       const mobileIndex = afterEmail.indexOf(mobileMatch[0]);
       collegeName = afterEmail.substring(0, mobileIndex).trim();
    } else {
       collegeName = afterEmail.split(/\s+/)[0] || "";
    }
    
    try {
        await prisma.user.upsert({
            where: { email },
            update: {},
            create: {
                email,
                name,
                role: "STUDENT",
                batchId,
                rollNumber,
                collegeName
            }
        });
        created++;
    } catch(e) {
        console.error("Failed to add", email);
    }
  }
  console.log("Successfully created", created, "students");
}

main().catch(console.error).finally(() => prisma.$disconnect());
