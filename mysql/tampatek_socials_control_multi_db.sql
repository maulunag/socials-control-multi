-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 06-04-2026 a las 16:45:27
-- Versión del servidor: 11.4.10-MariaDB
-- Versión de PHP: 8.4.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `tampatek_socials_control_multi_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `companies`
--

CREATE TABLE `companies` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `companies`
--

INSERT INTO `companies` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'TampaTeks', '2026-04-02 19:53:13', '2026-04-02 19:53:13'),
(2, 'SevenStudio', '2026-04-02 21:34:00', '2026-04-02 21:34:00'),
(3, 'Omar', '2026-04-02 21:34:07', '2026-04-02 21:34:07'),
(4, 'Company Demo 01', '2026-04-02 21:34:16', '2026-04-02 21:34:16');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `company_metricool_settings`
--

CREATE TABLE `company_metricool_settings` (
  `company_id` int(11) NOT NULL,
  `metricool_user_id` varchar(50) DEFAULT NULL,
  `metricool_token` varchar(255) DEFAULT NULL,
  `facebook_active` tinyint(1) DEFAULT 0,
  `instagram_active` tinyint(1) DEFAULT 0,
  `linkedin_active` tinyint(1) DEFAULT 0,
  `gmb_active` tinyint(1) DEFAULT 0,
  `twitter_active` tinyint(1) DEFAULT 0,
  `youtube_active` tinyint(1) DEFAULT 0,
  `tiktok_active` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `company_metricool_settings`
--

INSERT INTO `company_metricool_settings` (`company_id`, `metricool_user_id`, `metricool_token`, `facebook_active`, `instagram_active`, `linkedin_active`, `gmb_active`, `twitter_active`, `youtube_active`, `tiktok_active`, `created_at`, `updated_at`) VALUES
(1, '4505229', 'YUYFRBPBVSRLFWGKQYUKBVTLBDFDAQXYOJXFNCJUZHRYMCSPRTYSTQWTKPZSLJFS', 1, 1, 1, 1, 1, 1, 1, '2026-04-02 19:53:13', '2026-04-02 19:56:09'),
(2, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, '2026-04-02 21:34:00', '2026-04-02 21:34:00'),
(3, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, '2026-04-02 21:34:07', '2026-04-02 21:34:07'),
(4, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, '2026-04-02 21:34:16', '2026-04-02 21:34:16');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `content_topics`
--

CREATE TABLE `content_topics` (
  `id` int(11) NOT NULL,
  `id_company` int(11) NOT NULL DEFAULT 1,
  `title` varchar(500) NOT NULL COMMENT 'Topic title',
  `description` text DEFAULT NULL COMMENT 'Topic description/summary',
  `keywords` varchar(500) DEFAULT NULL COMMENT 'Comma-separated keywords',
  `category` varchar(255) DEFAULT NULL COMMENT 'Topic category',
  `status` enum('draft','ready','used') NOT NULL DEFAULT 'draft' COMMENT 'draft, ready for AI, or already used',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `content_topics`
--

INSERT INTO `content_topics` (`id`, `id_company`, `title`, `description`, `keywords`, `category`, `status`, `created_at`, `updated_at`) VALUES
(4, 1, 'Integrate Copilot agents into SharePoint the right way', 'Learn how to seamlessly integrate Copilot agents within your SharePoint environment for enhanced automation and collaboration. Discover best practices for agent deployment, security considerations, and optimizing workflows to leverage Copilot\'s capabilities effectively within your SharePoint ecosystem.', 'Copilot, SharePoint, agents, integration, automation, workflows', 'SharePoint', 'used', '2026-02-27 16:23:29', '2026-02-27 21:03:44'),
(5, 1, '5 rules of AI use in your business', 'Establish clear guidelines for AI adoption in your business. Cover data privacy, algorithm transparency, human oversight, bias mitigation, and continuous monitoring to ensure responsible and ethical AI implementation.', 'AI ethics, AI governance, data privacy, AI bias, AI transparency, responsible AI', 'Artificial Intelligence', 'used', '2026-02-27 16:30:51', '2026-02-27 21:06:15'),
(6, 1, 'Get ChatGPT to recommend your website', 'Learn how to optimize your website and content to be recommended by ChatGPT as a helpful resource. This involves understanding ChatGPT\'s knowledge base, providing high-quality and relevant information, and using schema markup to enhance discoverability.', 'ChatGPT, SEO, website optimization, content strategy, AI recommendation, knowledge base', 'SEO', 'used', '2026-02-27 16:32:18', '2026-02-27 21:10:46'),
(7, 1, 'Learn to setup your personal AI operating system', 'Discover how to build your own personalized AI operating system, tailored to your unique needs and workflows. Learn to integrate various AI tools, automate tasks, and enhance productivity by creating a seamless AI-powered environment.', 'AI OS, personal AI, AI automation, AI tools, productivity, custom AI', 'Artificial Intelligence', 'used', '2026-02-27 16:33:30', '2026-02-27 21:10:57'),
(8, 1, 'Stop trying to come up with content ideas. Start with a clear message that relates to your customer.', 'Stop brainstorming endless content ideas! Instead, define your core brand message and identify your ideal customer\'s pain points. Craft content that directly addresses those needs, building trust and driving engagement.', 'content strategy, customer focus, messaging, brand voice, audience needs, content marketing', 'Marketing', 'used', '2026-02-27 16:35:58', '2026-02-27 21:11:08'),
(9, 1, 'Are Chinese AI models as good as OpenAI and Claude Code?', 'Explore the current state of Chinese AI models\' coding capabilities compared to OpenAI\'s and Claude\'s offerings. Analyze their strengths, weaknesses, and specific use cases to determine if they measure up in terms of code generation, debugging, and overall performance in software development tasks.', 'AI models, China, OpenAI, Claude, Code Generation, Performance', 'Artificial Intelligence', 'used', '2026-02-27 16:37:21', '2026-02-27 21:11:19'),
(10, 1, 'With ChatGPT, SEO does not have to be hard', 'Discover how to leverage ChatGPT to simplify and enhance your SEO efforts. Learn practical strategies for keyword research, content optimization, and generating compelling meta descriptions that drive organic traffic to your website, and explore ethical uses of AI in SEO.', 'ChatGPT, SEO, AI, content optimization, keyword research, meta descriptions', 'Search Engine Optimization', 'used', '2026-02-27 16:38:21', '2026-02-27 21:11:27'),
(11, 1, 'How Law Firms Lose Billable Hours Without Realizing It. Most firms bleed time on intake, document handling, and follow-ups. AI automations quietly recover hours every week without hiring more staff.', 'Law firms unknowingly lose billable hours through inefficient intake processes, tedious document management, and inconsistent client follow-ups. Discover how AI-powered automation tools can seamlessly reclaim these lost hours, boosting productivity without increasing headcount. Learn to identify hidden time drains and implement AI solutions for a more profitable practice.', 'billable hours, law firms, AI automation, legal tech, time management, productivity', 'Legal Technology', 'used', '2026-03-18 16:07:42', '2026-03-18 17:44:52'),
(12, 1, '“AI Intake Assistants: The New First Paralegal” AI can qualify leads, collect case details, and schedule consultations—24/7—before a human ever touches the file.', 'Explore how AI intake assistants are transforming law firms by automating initial client interactions. Discuss the benefits of 24/7 availability, lead qualification, and efficient data collection, and explain how this technology streamlines workflows, freeing up paralegals for higher-level tasks.', 'AI, intake assistant, paralegal, legal tech, automation, lead qualification', 'Legal Technology', 'used', '2026-03-18 16:08:34', '2026-03-18 17:45:05'),
(13, 1, '“Document Chaos Is a Liability Risk” Disorganized files aren’t just inefficient—they’re dangerous. AI-powered document management reduces errors and exposure.', 'Highlight how disorganized documents increase legal and financial risks for businesses. Emphasize the benefits of AI-powered document management in reducing errors, improving compliance, and mitigating potential liabilities. Provide real-world examples of document chaos leading to negative consequences.', 'document management, liability, risk, compliance, AI, automation', 'Legal Tech', 'used', '2026-03-18 16:10:04', '2026-03-18 17:45:23'),
(14, 1, 'Why Small Law Firms Are Prime Targets for Cyber Attacks” Attackers know firms store sensitive data. Managed cybersecurity + AI monitoring closes the gaps most firms don’t see.', 'Small law firms often lack robust cybersecurity, making them ideal targets for cybercriminals seeking sensitive client data. Content should highlight the specific vulnerabilities of small firms and emphasize the importance of managed cybersecurity solutions and AI-powered monitoring to proactively identify and mitigate threats.', 'cybersecurity, law firms, data breach, cyber attacks, managed services, AI monitoring', 'Cybersecurity', 'used', '2026-03-18 16:10:43', '2026-03-18 17:45:36'),
(15, 1, '“AI for Legal ≠ Replacing Attorneys” AI handles the busywork so attorneys focus on strategy, advocacy, and billable work.', 'Debunk the myth that AI will replace lawyers. Instead, emphasize how AI tools automate tedious tasks, freeing up attorneys to concentrate on high-value activities like strategy, client interaction, and complex case analysis. Content should showcase AI as a tool that enhances, not replaces, legal expertise.', 'AI in law, legal tech, attorney, automation, legal AI, legal innovation', 'Legal Technology', 'used', '2026-03-18 16:11:32', '2026-03-18 17:45:49'),
(16, 1, '“Your Shop Floor Isn’t the Bottleneck—Your Systems Are” Disconnected systems slow production more than machines. AI bridges ERP, inventory, and operations automatically.', 'Highlight how disconnected systems (ERP, inventory, operations) create bottlenecks on the shop floor, hindering overall production efficiency. Explain how AI-powered integration can streamline workflows and eliminate manual data entry, resulting in improved throughput and reduced errors. Emphasize the ROI of system integration, focusing on tangible benefits like increased productivity and cost savings.', 'shop floor, bottlenecks, system integration, AI, ERP, automation', 'Manufacturing', 'used', '2026-03-18 16:12:51', '2026-03-18 17:46:02'),
(17, 1, '“AI That Predicts Delays Before They Happen” AI analytics flag supplier issues, inventory risks, and workflow slowdowns early—before margins take the hit.', 'Explore the transformative power of predictive AI in business operations. Learn how AI analytics can proactively identify potential delays in supply chains, inventory management, and workflows, enabling businesses to mitigate risks and protect profit margins.', 'predictive AI, supply chain, inventory management, workflow optimization, risk mitigation, AI analytics', 'Artificial Intelligence', 'used', '2026-03-18 16:15:45', '2026-03-18 17:46:13'),
(18, 1, '“Manual Reporting Is Costing You Accuracy and Time” Automated dashboards replace spreadsheets and outdated reports with real-time operational insights.', 'Showcase how manual reporting leads to errors, delays, and wasted resources. Highlight the benefits of automated dashboards, emphasizing real-time insights, improved accuracy, and time savings. Include specific examples of how businesses can benefit from switching to automated reporting.', 'automation, reporting, dashboards, accuracy, efficiency, real-time insights', 'Business Intelligence', 'used', '2026-03-18 16:16:34', '2026-03-18 17:46:26'),
(19, 1, '“Why Manufacturers Are Moving IT From ‘Cost’ to ‘Profit Protection’” Downtime and breaches are expensive. Managed IT + AI monitoring protects revenue, not just systems.', 'Manufacturers are increasingly viewing IT as a crucial investment for profit protection, rather than simply a cost center. Content should emphasize how managed IT services and AI-powered monitoring minimize downtime, prevent costly data breaches, and ultimately safeguard revenue streams. Provide specific examples of ROI achieved through proactive IT management.', 'manufacturing IT, managed services, cybersecurity, downtime, AI monitoring, profit protection', 'Manufacturing Technology', 'used', '2026-03-18 16:17:59', '2026-03-18 17:46:40'),
(20, 1, '“AI Doesn’t Replace Skilled Workers—It Protects Them” Automation removes repetitive tasks, reduces burnout, and keeps tribal knowledge inside the company.', 'Explore how AI automation alleviates repetitive tasks for skilled workers, freeing them to focus on complex problem-solving and innovation. Highlight AI\'s role in mitigating burnout and discuss how it preserves valuable institutional knowledge within the organization, ensuring long-term expertise and continuity. Demonstrate with concrete examples of workers benefitting from AI augmentation.', 'AI, automation, skilled workers, burnout, knowledge management, productivity', 'Technology', 'used', '2026-03-18 16:18:51', '2026-03-18 17:46:54'),
(21, 1, '“Busy Season Shouldn’t Break Your Team” AI handles intake, document collection, reminders, and status updates—so your accounting staff aren’t overwhelmed.', 'Discover how AI can revolutionize your accounting firm\'s busy season by automating tedious tasks like client intake and document collection. Learn how AI-powered reminders and status updates reduce staff workload and prevent burnout, leading to a happier, more productive team. Explore specific AI solutions that can be implemented to mitigate the stresses of busy season.', 'AI, accounting, automation, busy season, productivity, workflow', 'Accounting Technology', 'used', '2026-03-18 16:20:48', '2026-03-18 17:47:05'),
(22, 1, '“The Hidden Cost of Chasing CPA Clients for Documents” AI assistants follow up automatically and securely—no more manual reminders or email chains.', 'Discover the hidden costs associated with manually chasing CPA clients for documents, from wasted time and reduced productivity to increased errors and compliance risks. Learn how AI-powered automation can streamline the document collection process, freeing up your team to focus on higher-value tasks while ensuring data security and client satisfaction.', 'CPA, document collection, automation, AI, client management, efficiency', 'Accounting Technology', 'used', '2026-03-18 16:21:40', '2026-03-18 17:47:18'),
(23, 1, '“AI + Accounting: Accuracy Without Overhead” Automations reduce data entry errors while maintaining full human oversight.', 'Explore how AI-powered accounting tools minimize manual data entry errors, leading to increased accuracy and efficiency. Highlight the importance of retaining human oversight to ensure ethical and strategic financial management. Show specific examples of AI automations that reduce overhead.', 'AI accounting, automation, accuracy, efficiency, overhead reduction, human oversight', 'Accounting Technology', 'used', '2026-03-18 16:22:16', '2026-03-18 17:47:30'),
(24, 1, '“Why CPA Firms Are Prime Ransomware Targets” Financial data is gold. AI-driven threat detection + managed security drastically lowers risk.', 'CPA firms handle highly sensitive financial data, making them lucrative ransomware targets. Content should emphasize the value of this data to cybercriminals and highlight how AI-driven threat detection and managed security services significantly reduce ransomware risk for these firms, protecting client data and firm reputation.', 'CPA firms, ransomware, cybersecurity, financial data, AI threat detection, managed security', 'Cybersecurity', 'used', '2026-03-18 16:22:47', '2026-03-18 17:47:45'),
(25, 1, '“Client Experience Is the New Differentiator for CPAs” Fast responses, clarity, and automation keep clients loyal—even when fees increase.', 'In today\'s market, client experience is paramount for CPAs. Content should highlight how fast response times, clear communication, and automated processes enhance client satisfaction and justify pricing, emphasizing that superior service fosters loyalty even amidst fee increases.', 'client experience, CPA, customer service, automation, client retention, communication', 'Accounting', 'used', '2026-03-18 16:23:21', '2026-03-18 17:47:58'),
(26, 1, '“Staff Burnout Isn’t a Staffing Problem—It’s a Systems Problem” AI automates scheduling, intake, reminders, and admin tasks that exhaust healthcare teams.', 'Healthcare staff burnout is often rooted in systemic issues, not just staffing shortages. Content should highlight how AI-powered automation of tasks like scheduling, intake, and reminders can alleviate administrative burdens and improve staff well-being, leading to better patient care and reduced turnover.', 'staff burnout, AI automation, healthcare, systems problem, workflow optimization, administrative burden', 'Healthcare Technology', 'used', '2026-03-18 16:25:12', '2026-03-18 17:48:10'),
(27, 1, '“HIPAA Compliance Doesn’t Have to Slow You Down” AI-driven access controls and monitoring increase security without adding friction.', 'Address the common misconception that HIPAA compliance hinders efficiency. Highlight how AI-driven access controls and monitoring can streamline processes while strengthening security, ultimately improving workflow without compromising patient data protection. Offer practical examples of how these technologies can be implemented to achieve both compliance and efficiency.', 'HIPAA compliance, AI security, access control, data protection, healthcare technology, efficiency', 'Healthcare Technology', 'used', '2026-03-18 16:25:37', '2026-03-18 17:48:23'),
(28, 1, '“Why Missed Appointments Are an Automation Failure” AI reminders, confirmations, and follow-ups reduce no-shows dramatically.', 'Explore how AI-powered automation, specifically reminders, confirmations, and follow-ups, can significantly decrease missed appointments. Highlight the cost-effectiveness and improved patient/client experience that results from implementing these automated systems. Show how to implement an automated appointment reminder system to reduce no-shows.', 'appointment reminders, automation, AI, no-shows, patient engagement, scheduling', 'Automation', 'used', '2026-03-18 16:26:14', '2026-03-18 17:48:37'),
(29, 1, '“Healthcare IT Should Be Invisible—Until It Saves You” Proactive monitoring prevents outages before patient care is affected.', 'Craft content that highlights the importance of seamless healthcare IT infrastructure. Emphasize how proactive monitoring and maintenance ensure systems are always available, focusing on real-world scenarios where this \'invisibility\' directly improves patient outcomes and safety. Showcase the benefits of reliable IT for both medical staff and patients.', 'healthcare IT, proactive monitoring, system uptime, patient safety, IT infrastructure, data security', 'Healthcare Technology', 'used', '2026-03-18 16:26:43', '2026-03-18 17:48:50'),
(30, 1, '“AI in Healthcare Is About Time, Not Treatment” AI doesn’t diagnose—it gives providers more time with patients.', 'Explore how AI is revolutionizing healthcare by freeing up physicians\' time, not replacing their expertise in treatment. Highlight specific examples of AI tools automating administrative tasks and streamlining workflows, allowing for increased patient interaction and improved care quality.', 'AI in healthcare, healthcare automation, physician burnout, patient care, healthcare technology, administrative efficiency', 'Healthcare', 'used', '2026-03-18 16:27:18', '2026-03-18 17:49:03'),
(31, 1, '“Every Missed Lead Is Lost Revenue” AI assistants respond instantly, qualify prospects, and book showings—even after hours.', 'Highlight how AI assistants provide instant responses, ensuring no leads are missed. Emphasize the financial implications of missed leads and demonstrate how AI qualification and automated booking directly contribute to increased revenue.', 'AI assistant, lead generation, lead qualification, revenue, automation, sales', 'Artificial Intelligence', 'used', '2026-03-18 16:27:50', '2026-03-18 17:49:15'),
(32, 1, '“Why Top Agents Never Rely on Manual Follow-Ups” AI nurtures leads consistently so no opportunity falls through the cracks.', 'Explore how top real estate agents leverage AI to automate follow-ups, ensuring consistent communication and higher conversion rates. Learn the benefits of AI-powered systems, including improved efficiency and personalized engagement, that replace time-consuming manual processes.', 'AI, real estate, follow-up, automation, lead nurturing, CRM', 'Real Estate Technology', 'used', '2026-03-18 16:28:40', '2026-03-18 17:49:29'),
(33, 1, '“Property Management Is a Workflow Problem” Maintenance requests, tenant communication, and reporting can be automated end‑to‑end.', 'Property management inefficiencies often stem from disjointed workflows. Focus content on automating maintenance requests, streamlining tenant communication, and automating reporting to demonstrate time and cost savings.', 'property management, automation, workflow, tenant communication, maintenance, reporting', 'Real Estate', 'used', '2026-03-18 16:29:22', '2026-03-18 17:49:40'),
(34, 1, '“AI for Real Estate Isn’t Fancy—It’s Practical” Less admin, faster responses, happier clients, better reviews.', 'Show real estate professionals how AI tools can automate administrative tasks, improve client communication speed, and ultimately boost client satisfaction and online reviews. Focus on practical applications and tangible benefits, avoiding overly technical jargon.', 'AI in real estate, real estate automation, client communication, real estate reviews, AI tools, real estate technology', 'Real Estate Technology', 'used', '2026-03-18 16:29:58', '2026-03-18 17:49:52'),
(35, 1, '“Your CRM Isn’t Broken—It’s Underused” AI unlocks the value already sitting inside your tools.', 'Stop letting your CRM data collect dust! Learn how AI-powered features can automate tasks, personalize customer interactions, and generate actionable insights from your existing CRM. Discover practical strategies to maximize your CRM investment and boost sales and marketing performance using AI.', 'CRM, AI, automation, customer relationship management, data insights, sales', 'Technology', 'used', '2026-03-18 16:30:35', '2026-03-18 17:50:02'),
(36, 1, '“If Your Business Runs on Emails, You’re Already Behind” AI workflows replace inbox chaos with structured, automated execution.', 'Explore how AI-powered workflows are revolutionizing business processes by automating tasks traditionally managed through email. Learn how to transition from reactive email management to proactive, structured workflows for increased efficiency and reduced errors.', 'AI workflows, automation, email management, business process, productivity, efficiency', 'Business Automation', 'used', '2026-03-18 16:32:18', '2026-03-18 17:50:15'),
(37, 1, '“What Business Owners Get Wrong About AI” It’s not about replacing people—it’s about removing friction.', 'Many business owners mistakenly view AI as a complete workforce replacement. Content should emphasize AI\'s role in streamlining processes, improving efficiency, and augmenting human capabilities, not eliminating jobs. Focus on specific examples of AI tools that reduce friction and improve productivity.', 'AI adoption, business automation, AI implementation, productivity tools, AI strategy, workflow optimization', 'Artificial Intelligence', 'used', '2026-03-18 16:32:56', '2026-03-18 17:50:27'),
(38, 1, '“Why ‘We’re Too Small for AI’ Is the Most Expensive Belief” Smaller teams benefit the most from automation.', 'Debunk the myth that AI is only for large corporations. Highlight how AI tools can level the playing field for smaller teams by automating tasks, improving efficiency, and providing data-driven insights that were previously inaccessible. Focus on specific, affordable AI solutions that are practical for small businesses.', 'AI for small business, automation, productivity, efficiency, small teams, cost savings', 'Artificial Intelligence', 'used', '2026-03-18 16:33:41', '2026-03-18 17:50:40'),
(39, 1, '“AI That Actually Integrates With Your Existing Systems” No rip-and-replace. Just smarter connections.', 'Explore AI solutions designed for seamless integration with your current infrastructure, avoiding costly and disruptive overhauls. Focus on practical applications and demonstrate how these AI tools enhance existing workflows, improve data utilization, and deliver immediate value without requiring a complete system replacement.', 'AI integration, system compatibility, AI solutions, legacy systems, data integration, workflow automation', 'Artificial Intelligence', 'used', '2026-03-18 16:34:19', '2026-03-18 17:50:53'),
(40, 1, '“Talk to Our AI Before You Talk to Sales” Let prospects experience the difference immediately.', 'Highlight the benefits of interacting with your AI assistant before engaging with sales, such as instant answers, personalized product recommendations, and 24/7 availability. Emphasize how the AI can qualify leads and provide tailored information, saving both the prospect\'s and the sales team\'s time, leading to a more efficient and informed sales process.', 'AI assistant, lead qualification, sales efficiency, customer experience, personalized recommendations, instant support', 'Artificial Intelligence', 'used', '2026-03-18 16:35:06', '2026-03-18 17:51:05'),
(41, 1, 'How do I use AI in my small business', 'Explore practical AI applications for small businesses, focusing on tasks like automation, customer service, and marketing. Provide specific examples and tools that small business owners can easily implement to improve efficiency and profitability.', 'AI, small business, automation, efficiency, marketing, customer service', 'Business Technology', 'ready', '2026-03-29 18:13:29', '2026-03-29 18:13:29');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `company_id` int(11) DEFAULT NULL,
  `role` enum('SUPERADMIN','ADMIN','USER') NOT NULL DEFAULT 'USER',
  `name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `company_id`, `role`, `name`, `email`, `password_hash`, `created_at`, `updated_at`) VALUES
(1, NULL, 'SUPERADMIN', 'System Superadmin', 'superadmin@tampateks.com', '$2y$10$y/x0Tt9qlEkq2jyuvTXVvufTvcEXNKMpBiIt5Di1Da3SX.ZBHHypG', '2026-04-02 18:41:44', '2026-04-03 17:32:40'),
(4, NULL, 'SUPERADMIN', 'Mau Luna', 'maulunag@gmail.com', '$2y$10$KbrdC6WwygZqv61Fo.HgQ.mGKfwvmUIHbiMOd3nAsSPO1AwP1/P4e', '2026-04-02 21:25:02', '2026-04-02 21:25:02'),
(5, 1, 'ADMIN', 'Maury Luna', 'maury@tampateks.com', '$2y$10$1iyZsrbX1bzgc5UQGS4kXuf6xZBxDCs/CUUEwdpirr0m7f1ogNI0y', '2026-04-02 21:26:05', '2026-04-02 21:29:38'),
(6, 1, 'USER', 'user1', 'user1@tampateks.com', '$2y$10$9mmDvukbYN1CBbExscaA3OwLfBnr7rfPfkMjyXyatDPXvo3Z2WQ8O', '2026-04-02 21:30:05', '2026-04-02 21:30:05'),
(7, NULL, 'SUPERADMIN', 'Cesar', 'cesar@tampateks.com', '$2y$10$rxUWt0h/JVVoOPZjnB87OuDgAqdSRcft3w9joCov6C3TDzzKNFqIS', '2026-04-03 17:33:15', '2026-04-03 17:33:50');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `companies`
--
ALTER TABLE `companies`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `company_metricool_settings`
--
ALTER TABLE `company_metricool_settings`
  ADD PRIMARY KEY (`company_id`);

--
-- Indices de la tabla `content_topics`
--
ALTER TABLE `content_topics`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_category` (`category`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `company_id` (`company_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `companies`
--
ALTER TABLE `companies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `content_topics`
--
ALTER TABLE `content_topics`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `company_metricool_settings`
--
ALTER TABLE `company_metricool_settings`
  ADD CONSTRAINT `company_metricool_settings_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
