"use client"

import React, { useState, useEffect } from "react"
import {
  Search,
  Heart,
  Github,
  Download,
  Filter,
  Check,
  ChevronDown,
  ChevronUp,
  Info,
  User,
  LogOut,
  Star,
  Plus,
  Loader2,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { createClient } from '@supabase/supabase-js'
import ToolCard from "@/components/tools/ToolCard"
import ToolGrid from "@/components/tools/ToolGrid"
import FilterPanel from "@/components/tools/FilterPanel"
import AuthModal from "@/components/auth/AuthModal"
import CompareControls from "@/components/tools/CompareControls"
import RecentlyViewed from "@/components/tools/RecentlyViewed"
import ReviewModal from "@/components/tools/ReviewModal"
import SubmitToolModal from "@/components/tools/SubmitToolModal"
import CollectionsModal from "@/components/tools/CollectionsModal"
import ComparisonModal from "@/components/tools/ComparisonModal"

// Initialize Supabase client with safe environment variable handling
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Create Supabase client with validation
let supabase: ReturnType<typeof createClient>
if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
} else {
  console.error('⚠️ Missing Supabase environment variables. App will use fallback data.')
  // Create a dummy client that won't be used (tools will fall back to local data)
  supabase = createClient('https://dummy.supabase.co', 'dummy-key')
}

// Tool interface
interface Tool {
  id: number
  name: string
  description: string
  category: string
  status: "online" | "offline" | "warning"
  url: string
  pricing: "Free" | "Freemium" | "Paid"
  registration: boolean
  created_at?: string
  updated_at?: string
}

// Mock user type
interface OsintUser {
  id: string
  email: string
  name: string
}

// Review interface
interface Review {
  id: string
  toolId: number
  userId: string
  userEmail: string
  rating: number
  comment: string
  date: string
  helpful: number
}

// Mock reviews data
const mockReviews = {
  1: { rating: 4.5, count: 23 },
  2: { rating: 4.2, count: 18 },
  3: { rating: 3.8, count: 12 },
  4: { rating: 4.7, count: 31 },
  5: { rating: 3.2, count: 8 },
  11: { rating: 4.9, count: 156 },
  13: { rating: 4.8, count: 89 },
  23: { rating: 4.3, count: 45 },
  30: { rating: 4.6, count: 78 },
  42: { rating: 4.4, count: 67 },
}

// Fallback tools array (in case Supabase fails)
const fallbackTools: Tool[] = [
  // Username/Social Media Tools
  {
    id: 1,
    name: "Sherlock",
    description:
      "Hunt down social media accounts by username across 400+ social networks. This tool searches for usernames across social networks and websites, making it essential for finding all online accounts associated with a specific username during investigations.",
    category: "Username",
    status: "online",
    url: "https://github.com/sherlock-project/sherlock",
    pricing: "Free",
    registration: false,
  },
  {
    id: 2,
    name: "WhatsMyName",
    description:
      "Username enumeration tool that checks for username availability across multiple platforms. It helps investigators find social media accounts and online presence associated with specific usernames across various websites and services.",
    category: "Username",
    status: "online",
    url: "https://whatsmyname.app/",
    pricing: "Free",
    registration: false,
  },
  {
    id: 3,
    name: "Namechk",
    description:
      "Check username and domain availability across hundreds of social networks and domain extensions. This tool is useful for brand monitoring and finding available usernames across multiple platforms simultaneously.",
    category: "Username",
    status: "online",
    url: "https://namechk.com/",
    pricing: "Free",
    registration: false,
  },
  {
    id: 4,
    name: "Social Searcher",
    description:
      "Real-time social media search engine and monitoring tool. Search for content across multiple social media platforms simultaneously, useful for monitoring mentions, tracking hashtags, and gathering social media intelligence.",
    category: "Social Media",
    status: "online",
    url: "https://www.social-searcher.com/",
    pricing: "Freemium",
    registration: true,
  },
  {
    id: 5,
    name: "Twint",
    description:
      "Advanced Twitter scraping tool that works without using Twitter's API. Gather tweets, followers, and other Twitter data without API limitations, particularly useful for social media investigations and sentiment analysis projects.",
    category: "Social Media",
    status: "offline",
    url: "https://github.com/twintproject/twint",
    pricing: "Free",
    registration: false,
  },
  {
    id: 6,
    name: "IntelTechniques",
    description:
      "Comprehensive collection of OSINT tools and custom search engines for social media investigation. Created by Michael Bazzell, this platform provides specialized search tools for various social media platforms and online services.",
    category: "Social Media",
    status: "online",
    url: "https://inteltechniques.com/tools/",
    pricing: "Free",
    registration: false,
  },

  // Email Tools
  {
    id: 7,
    name: "theHarvester",
    description:
      "Gather emails, subdomains, hosts, employee names from public sources. Uses multiple search engines and data sources to collect information about a target domain, essential for reconnaissance and information gathering phases.",
    category: "Email",
    status: "online",
    url: "https://github.com/laramies/theHarvester",
    pricing: "Free",
    registration: false,
  },
  {
    id: 8,
    name: "Have I Been Pwned",
    description:
      "Check if email addresses have been compromised in data breaches. Search across multiple data breaches to see if an email address has been compromised, crucial for security assessments and personal security awareness.",
    category: "Email",
    status: "online",
    url: "https://haveibeenpwned.com/",
    pricing: "Freemium",
    registration: false,
  },
  {
    id: 9,
    name: "Hunter.io",
    description:
      "Find and verify professional email addresses associated with any website or company. This tool helps locate contact information for businesses and individuals, useful for outreach and investigation purposes.",
    category: "Email",
    status: "online",
    url: "https://hunter.io/",
    pricing: "Freemium",
    registration: true,
  },
  {
    id: 10,
    name: "Holehe",
    description:
      "Check if an email address is attached to an account on over 120 websites. This tool helps investigators determine which services an email address is registered with, useful for account enumeration and investigation.",
    category: "Email",
    status: "online",
    url: "https://github.com/megadose/holehe",
    pricing: "Free",
    registration: false,
  },

  // Network Tools
  {
    id: 11,
    name: "Shodan",
    description:
      "Search engine for Internet-connected devices and services. Crawls the internet to find and index devices like webcams, routers, servers, and IoT devices, invaluable for security researchers and penetration testers.",
    category: "Network",
    status: "online",
    url: "https://www.shodan.io/",
    pricing: "Freemium",
    registration: true,
  },
  {
    id: 12,
    name: "Censys",
    description:
      "Search engine for finding and analyzing Internet-connected devices. Provides detailed information about hosts and websites across the internet, offering more detailed analysis than basic port scanners for security research.",
    category: "Network",
    status: "online",
    url: "https://censys.io/",
    pricing: "Freemium",
    registration: true,
  },
  {
    id: 13,
    name: "Nmap",
    description:
      "Network discovery and security auditing tool. Industry standard for network reconnaissance and security scanning, can discover hosts, services, operating systems, and vulnerabilities across networks.",
    category: "Network",
    status: "online",
    url: "https://nmap.org/",
    pricing: "Free",
    registration: false,
  },
  {
    id: 14,
    name: "Masscan",
    description:
      "High-speed port scanner capable of scanning the entire Internet in under 6 minutes. Designed for large-scale network reconnaissance and security assessments, particularly useful for discovering open ports across large IP ranges.",
    category: "Network",
    status: "online",
    url: "https://github.com/robertdavidgraham/masscan",
    pricing: "Free",
    registration: false,
  },

  // Domains Tools
  {
    id: 15,
    name: "WhoisXML API",
    description:
      "Domain and IP address WHOIS lookup and research tools. Provides comprehensive domain registration data, DNS records, and historical WHOIS information essential for investigating domain ownership and registration patterns.",
    category: "Domains",
    status: "online",
    url: "https://whoisxmlapi.com/",
    pricing: "Freemium",
    registration: true,
  },
  {
    id: 16,
    name: "DNSdumpster",
    description:
      "Free domain research tool that discovers hosts related to a domain. Provides DNS reconnaissance and mapping, helping investigators understand the infrastructure and subdomains associated with a target domain.",
    category: "Domains",
    status: "online",
    url: "https://dnsdumpster.com/",
    pricing: "Free",
    registration: false,
  },
  {
    id: 17,
    name: "Sublist3r",
    description:
      "Subdomain enumeration tool designed to enumerate subdomains using OSINT. Gathers subdomains from various sources including search engines, helping map out the complete infrastructure of a target domain.",
    category: "Domains",
    status: "online",
    url: "https://github.com/aboul3la/Sublist3r",
    pricing: "Free",
    registration: false,
  },
  {
    id: 18,
    name: "SecurityTrails",
    description:
      "Historical DNS data and domain intelligence platform. Provides comprehensive DNS history, subdomain discovery, and domain monitoring capabilities for security research and threat intelligence.",
    category: "Domains",
    status: "online",
    url: "https://securitytrails.com/",
    pricing: "Freemium",
    registration: true,
  },

  // People Tools
  {
    id: 19,
    name: "Pipl",
    description:
      "People search engine for finding personal information. Searches deep web sources and public records to find comprehensive information about individuals, effective for finding contact information and social media profiles.",
    category: "People",
    status: "online",
    url: "https://pipl.com/",
    pricing: "Paid",
    registration: true,
  },
  {
    id: 20,
    name: "TruePeopleSearch",
    description:
      "Free people search engine providing access to public records. Find contact information, addresses, phone numbers, and associated individuals using publicly available data sources.",
    category: "People",
    status: "online",
    url: "https://www.truepeoplesearch.com/",
    pricing: "Free",
    registration: false,
  },
  {
    id: 21,
    name: "FastPeopleSearch",
    description:
      "Quick people search tool for finding personal information from public records. Provides addresses, phone numbers, and associated individuals, useful for background research and contact information discovery.",
    category: "People",
    status: "online",
    url: "https://www.fastpeoplesearch.com/",
    pricing: "Free",
    registration: false,
  },
  {
    id: 22,
    name: "Spokeo",
    description:
      "People search engine that aggregates public records and social media information. Provides comprehensive profiles including contact information, social media accounts, and background information.",
    category: "People",
    status: "online",
    url: "https://www.spokeo.com/",
    pricing: "Freemium",
    registration: true,
  },

  // Images Tools
  {
    id: 23,
    name: "TinEye",
    description:
      "Reverse image search engine to find where images appear online. Helps investigators track the origin and usage of images across the web, useful for verifying image authenticity and finding higher resolution versions.",
    category: "Images",
    status: "online",
    url: "https://tineye.com/",
    pricing: "Freemium",
    registration: false,
  },
  {
    id: 24,
    name: "Google Images",
    description:
      "Google's reverse image search functionality. Upload or paste image URLs to find similar images, identify objects, and discover where images appear online, integrated into Google's search ecosystem.",
    category: "Images",
    status: "online",
    url: "https://images.google.com/",
    pricing: "Free",
    registration: false,
  },
  {
    id: 25,
    name: "Yandex Images",
    description:
      "Yandex's reverse image search engine, often more effective than Google for certain types of images. Particularly good at facial recognition and finding images from Eastern European and Russian sources.",
    category: "Images",
    status: "online",
    url: "https://yandex.com/images/",
    pricing: "Free",
    registration: false,
  },
  {
    id: 26,
    name: "Jeffrey's Image Metadata Viewer",
    description:
      "Online tool for extracting and viewing EXIF data from images. Reveals camera settings, GPS coordinates, timestamps, and other metadata that can be crucial for image analysis and verification.",
    category: "Images",
    status: "online",
    url: "http://exif.regex.info/exif.cgi",
    pricing: "Free",
    registration: false,
  },

  // Geolocation Tools
  {
    id: 27,
    name: "GeoSpy",
    description:
      "AI-powered geolocation tool that can identify locations from images. Uses machine learning to analyze visual clues in photographs to determine where they were taken, useful for image verification and investigation.",
    category: "Geolocation",
    status: "online",
    url: "https://geospy.web.app/",
    pricing: "Free",
    registration: false,
  },
  {
    id: 28,
    name: "What3Words",
    description:
      "Location reference system that divides the world into 3m x 3m squares, each with a unique three-word address. Useful for precise location identification and sharing coordinates in an easy-to-remember format.",
    category: "Geolocation",
    status: "online",
    url: "https://what3words.com/",
    pricing: "Free",
    registration: false,
  },
  {
    id: 29,
    name: "GeoGuessr",
    description:
      "Geography game that can be used for location training and geolocation skills development. While primarily a game, it's useful for training investigators to recognize geographical features and locations.",
    category: "Geolocation",
    status: "online",
    url: "https://www.geoguessr.com/",
    pricing: "Freemium",
    registration: true,
  },

  // Archive Tools
  {
    id: 30,
    name: "Wayback Machine",
    description:
      "View archived versions of websites from the past. The Internet Archive's tool stores billions of web pages over time, essential for seeing how websites looked in the past and recovering deleted content.",
    category: "Archive Tools",
    status: "online",
    url: "https://web.archive.org/",
    pricing: "Free",
    registration: false,
  },
  {
    id: 31,
    name: "Archive.today",
    description:
      "Website archiving service that creates permanent snapshots of web pages. Useful for preserving evidence and accessing content that may have been removed or modified since original publication.",
    category: "Archive Tools",
    status: "online",
    url: "https://archive.today/",
    pricing: "Free",
    registration: false,
  },
  {
    id: 32,
    name: "CachedView",
    description:
      "Access cached versions of websites from Google, Bing, and other search engines. Provides multiple sources for viewing previously indexed versions of web pages when current versions are unavailable.",
    category: "Archive Tools",
    status: "online",
    url: "http://cachedview.com/",
    pricing: "Free",
    registration: false,
  },

  // Documents Tools
  {
    id: 33,
    name: "FOCA",
    description:
      "Find metadata and hidden information in documents. Analyzes documents found on web pages and extracts valuable metadata that can reveal information about software used, usernames, and folder paths.",
    category: "Documents",
    status: "warning",
    url: "https://github.com/ElevenPaths/FOCA",
    pricing: "Free",
    registration: false,
  },
  {
    id: 34,
    name: "Metagoofil",
    description:
      "Extract metadata from public documents found on target websites. Searches for and downloads documents from target websites, then extracts metadata that can reveal internal network information.",
    category: "Documents",
    status: "warning",
    url: "https://github.com/laramies/metagoofil",
    pricing: "Free",
    registration: false,
  },
  {
    id: 35,
    name: "DocumentCloud",
    description:
      "Platform for analyzing, annotating, and publishing documents. Provides tools for document analysis, OCR, and collaborative investigation, particularly useful for investigative journalism and research.",
    category: "Documents",
    status: "online",
    url: "https://www.documentcloud.org/",
    pricing: "Free",
    registration: true,
  },

  // Analysis Tools
  {
    id: 36,
    name: "Maltego",
    description:
      "Interactive data mining tool for link analysis and data visualization. Provides a graphical interface for analyzing relationships between people, companies, domains, and other entities for complex relationship mapping.",
    category: "Analysis",
    status: "online",
    url: "https://www.maltego.com/",
    pricing: "Freemium",
    registration: true,
  },
  {
    id: 37,
    name: "Gephi",
    description:
      "Open-source network analysis and visualization software. Helps investigators visualize and analyze complex networks and relationships, particularly useful for social network analysis and data visualization.",
    category: "Analysis",
    status: "online",
    url: "https://gephi.org/",
    pricing: "Free",
    registration: false,
  },
  {
    id: 38,
    name: "Palantir Gotham",
    description:
      "Enterprise data analysis platform for large-scale investigations. Integrates multiple data sources and provides advanced analytics capabilities for complex investigations and intelligence analysis.",
    category: "Analysis",
    status: "online",
    url: "https://www.palantir.com/platforms/gotham/",
    pricing: "Paid",
    registration: true,
  },

  // Reconnaissance Tools
  {
    id: 39,
    name: "Recon-ng",
    description:
      "Full-featured reconnaissance framework with modular design. Provides a powerful environment for conducting open-source web-based reconnaissance with independent modules and database interaction.",
    category: "Reconnaissance",
    status: "online",
    url: "https://github.com/lanmaster53/recon-ng",
    pricing: "Free",
    registration: false,
  },
  {
    id: 40,
    name: "SpiderFoot",
    description:
      "Automated OSINT collection tool for reconnaissance and threat intelligence. Automates the process of gathering intelligence about a given target, integrating with multiple data sources for comprehensive scans.",
    category: "Automation",
    status: "offline",
    url: "https://www.spiderfoot.net/",
    pricing: "Freemium",
    registration: false,
  },
  {
    id: 41,
    name: "Amass",
    description:
      "In-depth attack surface mapping and asset discovery tool. Performs network mapping of attack surfaces and external asset discovery using open source information gathering and active reconnaissance techniques.",
    category: "Reconnaissance",
    status: "online",
    url: "https://github.com/OWASP/Amass",
    pricing: "Free",
    registration: false,
  },

  // Threat Intelligence Tools
  {
    id: 42,
    name: "VirusTotal",
    description:
      "Free online service that analyzes files and URLs for malicious content. Aggregates results from multiple antivirus engines and website scanners, essential for malware analysis and threat intelligence.",
    category: "Threat Intelligence",
    status: "online",
    url: "https://www.virustotal.com/",
    pricing: "Freemium",
    registration: true,
  },
  {
    id: 43,
    name: "AlienVault OTX",
    description:
      "Open threat intelligence community platform. Provides access to threat data from security researchers worldwide, including indicators of compromise, attack patterns, and threat intelligence feeds.",
    category: "Threat Intelligence",
    status: "online",
    url: "https://otx.alienvault.com/",
    pricing: "Free",
    registration: true,
  },
  {
    id: 44,
    name: "ThreatCrowd",
    description:
      "Search engine for threats that provides context and connections between indicators. Helps analysts understand relationships between domains, IPs, email addresses, and file hashes in threat investigations.",
    category: "Threat Intelligence",
    status: "online",
    url: "https://www.threatcrowd.org/",
    pricing: "Free",
    registration: false,
  },
  {
    id: 45,
    name: "Hybrid Analysis",
    description:
      "Free malware analysis service powered by Falcon Sandbox. Provides detailed analysis reports for suspicious files and URLs, including behavioral analysis and threat intelligence indicators.",
    category: "Threat Intelligence",
    status: "online",
    url: "https://www.hybrid-analysis.com/",
    pricing: "Free",
    registration: true,
  },

  // AI-Powered Tools
  {
    id: 46,
    name: "Bellingcat's Auto Archiver",
    description:
      "AI-powered tool for automatically archiving social media content. Uses machine learning to identify and preserve important content from social media platforms for investigative purposes.",
    category: "AI-Powered Tools",
    status: "online",
    url: "https://github.com/bellingcat/auto-archiver",
    pricing: "Free",
    registration: false,
  },
  {
    id: 47,
    name: "FaceCheck.ID",
    description:
      "AI-powered reverse face search engine. Uses facial recognition technology to find images of people across the internet, useful for identity verification and investigation purposes.",
    category: "AI-Powered Tools",
    status: "online",
    url: "https://facecheck.id/",
    pricing: "Freemium",
    registration: true,
  },
  {
    id: 48,
    name: "PimEyes",
    description:
      "AI-powered face search engine that finds faces across the internet. Uses advanced facial recognition to locate images of individuals across various websites and platforms.",
    category: "AI-Powered Tools",
    status: "online",
    url: "https://pimeyes.com/",
    pricing: "Freemium",
    registration: true,
  },

  // Dark Web Search Tools
  {
    id: 49,
    name: "Ahmia",
    description:
      "Search engine for Tor hidden services. Provides a way to search for content on the dark web while maintaining anonymity, useful for threat intelligence and cybercrime investigation.",
    category: "Dark Web Search",
    status: "online",
    url: "https://ahmia.fi/",
    pricing: "Free",
    registration: false,
  },
  {
    id: 50,
    name: "DarkSearch",
    description:
      "Dark web search engine that indexes .onion sites. Provides search capabilities for Tor hidden services, helping investigators find relevant content on the dark web.",
    category: "Dark Web Search",
    status: "online",
    url: "https://darksearch.io/",
    pricing: "Free",
    registration: false,
  },
  {
    id: 51,
    name: "OnionLand",
    description:
      "Search engine for Tor network hidden services. Indexes and provides search functionality for .onion sites, useful for dark web research and investigation.",
    category: "Dark Web Search",
    status: "online",
    url: "https://onionlandsearchengine.com/",
    pricing: "Free",
    registration: false,
  },

  // Digital Currency Tools
  {
    id: 52,
    name: "Blockchain.info",
    description:
      "Bitcoin blockchain explorer and wallet service. Provides detailed information about Bitcoin transactions, addresses, and blocks, essential for cryptocurrency investigation and analysis.",
    category: "Digital Currency",
    status: "online",
    url: "https://www.blockchain.com/explorer",
    pricing: "Free",
    registration: false,
  },
  {
    id: 53,
    name: "Etherscan",
    description:
      "Ethereum blockchain explorer and analytics platform. Provides comprehensive information about Ethereum transactions, smart contracts, and addresses for cryptocurrency investigation.",
    category: "Digital Currency",
    status: "online",
    url: "https://etherscan.io/",
    pricing: "Free",
    registration: false,
  },
  {
    id: 54,
    name: "Crystal Blockchain",
    description:
      "Professional blockchain analytics platform for cryptocurrency investigation. Provides advanced tools for tracking cryptocurrency transactions and identifying suspicious activity.",
    category: "Digital Currency",
    status: "online",
    url: "https://crystalblockchain.com/",
    pricing: "Paid",
    registration: true,
  },
  {
    id: 55,
    name: "Chainalysis",
    description:
      "Cryptocurrency investigation and compliance platform. Provides tools for tracking cryptocurrency transactions, identifying illicit activity, and ensuring regulatory compliance.",
    category: "Digital Currency",
    status: "online",
    url: "https://www.chainalysis.com/",
    pricing: "Paid",
    registration: true,
  },

  // Transportation Tracking Tools
  {
    id: 56,
    name: "FlightRadar24",
    description:
      "Real-time flight tracking service showing aircraft movements worldwide. Provides detailed information about flights, aircraft, and airports, useful for transportation intelligence and investigation.",
    category: "Transportation Tracking",
    status: "online",
    url: "https://www.flightradar24.com/",
    pricing: "Freemium",
    registration: false,
  },
  {
    id: 57,
    name: "MarineTraffic",
    description:
      "Global ship tracking intelligence platform. Provides real-time information about vessel movements, port activities, and maritime traffic worldwide for transportation investigation.",
    category: "Transportation Tracking",
    status: "online",
    url: "https://www.marinetraffic.com/",
    pricing: "Freemium",
    registration: false,
  },
  {
    id: 58,
    name: "FlightAware",
    description:
      "Flight tracking and aviation data platform. Provides comprehensive flight information, aircraft tracking, and aviation analytics for transportation intelligence and investigation.",
    category: "Transportation Tracking",
    status: "online",
    url: "https://flightaware.com/",
    pricing: "Freemium",
    registration: false,
  },
  {
    id: 59,
    name: "VesselFinder",
    description:
      "Ship tracking and maritime intelligence platform. Provides real-time vessel positions, port information, and maritime traffic data for shipping and transportation investigation.",
    category: "Transportation Tracking",
    status: "online",
    url: "https://www.vesselfinder.com/",
    pricing: "Freemium",
    registration: false,
  },

  // Encoding/Decoding Tools
  {
    id: 60,
    name: "CyberChef",
    description:
      "Web app for encryption, encoding, compression and data analysis. Provides a wide range of operations for data manipulation, decoding, and analysis, essential for digital forensics and investigation.",
    category: "Encoding/Decoding",
    status: "online",
    url: "https://gchq.github.io/CyberChef/",
    pricing: "Free",
    registration: false,
  },
  {
    id: 61,
    name: "Base64 Decode",
    description:
      "Simple online tool for Base64 encoding and decoding. Useful for decoding Base64 encoded data commonly found in web applications, emails, and other digital communications.",
    category: "Encoding/Decoding",
    status: "online",
    url: "https://www.base64decode.org/",
    pricing: "Free",
    registration: false,
  },
  {
    id: 62,
    name: "URL Decoder",
    description:
      "Online tool for URL encoding and decoding. Helps decode URL-encoded strings and parameters, useful for web application analysis and digital investigation.",
    category: "Encoding/Decoding",
    status: "online",
    url: "https://www.urldecoder.org/",
    pricing: "Free",
    registration: false,
  },

  // Dating Platforms Tools
  {
    id: 63,
    name: "Social Catfish",
    description:
      "Reverse search tool for dating profiles and social media accounts. Helps verify the authenticity of online dating profiles and identify potential catfish or fraudulent accounts.",
    category: "Dating Platforms",
    status: "online",
    url: "https://socialcatfish.com/",
    pricing: "Freemium",
    registration: true,
  },
  {
    id: 64,
    name: "BeenVerified",
    description:
      "Background check service that includes social media and dating profile searches. Provides comprehensive background information including potential dating profiles and social media presence.",
    category: "Dating Platforms",
    status: "online",
    url: "https://www.beenverified.com/",
    pricing: "Paid",
    registration: true,
  },

  // Additional Geolocation Tools
  {
    id: 65,
    name: "Creepy",
    description:
      "Geolocation OSINT tool for gathering location data from social media. Extracts geographical information from social media posts and photos to create location timelines for investigation purposes.",
    category: "Geolocation",
    status: "offline",
    url: "https://github.com/ilektrojohn/creepy",
    pricing: "Free",
    registration: false,
  },

  // Additional Network Tools
  {
    id: 66,
    name: "Wigle",
    description:
      "Wireless network mapping and wardriving database. Provides information about wireless access points and their locations, useful for geolocation and network investigation.",
    category: "Network",
    status: "online",
    url: "https://wigle.net/",
    pricing: "Free",
    registration: true,
  },

  // Additional Email Tools
  {
    id: 67,
    name: "Phonebook.cz",
    description:
      "Search engine for finding information about domains, URLs, and email addresses. Provides comprehensive search capabilities for various types of online information and digital footprints.",
    category: "Email",
    status: "online",
    url: "https://phonebook.cz/",
    pricing: "Free",
    registration: false,
  },

  // Additional Threat Intelligence Tools
  {
    id: 68,
    name: "Dehashed",
    description:
      "Database search engine for leaked credentials and data breaches. Provides access to compromised credentials from various data breaches for security research and investigation.",
    category: "Threat Intelligence",
    status: "online",
    url: "https://dehashed.com/",
    pricing: "Paid",
    registration: true,
  },
  {
    id: 69,
    name: "Intelligence X",
    description:
      "Search engine and data archive for OSINT research. Provides access to various data sources including leaked databases, documents, and other intelligence information.",
    category: "Threat Intelligence",
    status: "online",
    url: "https://intelx.io/",
    pricing: "Freemium",
    registration: true,
  },

  // Additional Network Tools
  {
    id: 70,
    name: "Spyse",
    description:
      "Internet assets search engine for cybersecurity professionals. Provides comprehensive information about domains, IPs, certificates, and other internet infrastructure for security research.",
    category: "Network",
    status: "online",
    url: "https://spyse.com/",
    pricing: "Freemium",
    registration: true,
  },

  // Additional Analysis Tools
  {
    id: 71,
    name: "OSINT Framework",
    description:
      "Comprehensive collection of OSINT tools organized by category. Provides a structured approach to open source intelligence gathering with links to hundreds of useful tools and resources.",
    category: "Analysis",
    status: "online",
    url: "https://osintframework.com/",
    pricing: "Free",
    registration: false,
  },
  {
    id: 72,
    name: "Hunchly",
    description:
      "Web capture tool designed for online investigations. Automatically captures and organizes web pages, images, and other content during investigations for evidence preservation and analysis.",
    category: "Analysis",
    status: "online",
    url: "https://www.hunch.ly/",
    pricing: "Paid",
    registration: true,
  },
  {
    id: 73,
    name: "Lampyre",
    description:
      "Data analysis and visualization platform for investigations. Provides tools for analyzing large datasets, creating timelines, and visualizing relationships between entities in investigations.",
    category: "Analysis",
    status: "online",
    url: "https://lampyre.io/",
    pricing: "Freemium",
    registration: true,
  },
  {
    id: 74,
    name: "Mitaka",
    description:
      "Browser extension for OSINT search from context menu. Allows quick searches across multiple OSINT tools directly from selected text in web browsers, streamlining investigation workflows.",
    category: "Analysis",
    status: "online",
    url: "https://github.com/ninoseki/mitaka",
    pricing: "Free",
    registration: false,
  },

  // Additional Reconnaissance Tools
  {
    id: 75,
    name: "Sn1per",
    description:
      "Automated penetration testing framework with OSINT capabilities. Combines reconnaissance, vulnerability scanning, and exploitation in a single platform for comprehensive security assessments.",
    category: "Reconnaissance",
    status: "online",
    url: "https://github.com/1N3/Sn1per",
    pricing: "Freemium",
    registration: false,
  },
]

const categories = [
  "All",
  "Username",
  "Email",
  "Social Media",
  "Network",
  "Analysis",
  "People",
  "Images",
  "Documents",
  "Domains",
  "Geolocation",
  "Archive Tools",
  "Reconnaissance",
  "Automation",
  "Threat Intelligence",
  "AI-Powered Tools",
  "Dark Web Search",
  "Digital Currency",
  "Transportation Tracking",
  "Encoding/Decoding",
  "Dating Platforms",
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "online":
      return "bg-emerald-500"
    case "offline":
      return "bg-red-500"
    case "warning":
      return "bg-amber-500"
    default:
      return "bg-gray-400"
  }
}

const getPricingColor = (pricing: string) => {
  switch (pricing) {
    case "Free":
      return "bg-green-50 text-green-700 border-green-200 font-medium"
    case "Freemium":
      return "bg-blue-50 text-blue-700 border-blue-200 font-medium"
    case "Paid":
      return "bg-orange-50 text-orange-700 border-orange-200 font-medium"
    default:
      return "bg-gray-50 text-gray-700 border-gray-200 font-medium"
  }
}

// Star rating component
const StarRating = ({ rating, count }: { rating: number; count: number }) => {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0

  return (
    <div className="flex items-center space-x-1">
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-3 h-3 ${
              i < fullStars
                ? "fill-white text-white"
                : i === fullStars && hasHalfStar
                  ? "fill-white/50 text-white"
                  : "text-gray-300"
            }`}
          />
        ))}
      </div>
      <span className="text-xs text-gray-500">
        {rating} ({count})
      </span>
    </div>
  )
}

// Interactive star rating component for review form
const InteractiveStarRating = ({ 
  rating, 
  onRatingChange 
}: { 
  rating: number
  onRatingChange: (rating: number) => void 
}) => {
  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRatingChange(star)}
          className="focus:outline-none"
        >
          <Star
            className={`w-6 h-6 transition-colors duration-200 ${
              star <= rating
                ? "fill-white text-white"
                : "text-gray-300 hover:text-gray-400"
            }`}
          />
        </button>
      ))}
      <span className="text-sm text-gray-600 ml-2">
        {rating > 0 ? `${rating} star${rating > 1 ? 's' : ''}` : 'Select rating'}
      </span>
    </div>
  )
}

// Helper function to get review statistics for a tool
const getToolReviews = (toolId: number, allReviews: Review[]) => {
  const toolReviews = allReviews.filter((review) => review.toolId === toolId)
  if (toolReviews.length === 0) return null

  const averageRating = toolReviews.reduce((sum, review) => sum + review.rating, 0) / toolReviews.length
  return {
    rating: Math.round(averageRating * 10) / 10,
    count: toolReviews.length,
    reviews: toolReviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3)
  }
}

// localStorage utility functions with error handling
const safeLocalStorageGet = (key: string): string | null => {
  try {
    return localStorage.getItem(key)
  } catch (error) {
    console.warn(`Failed to read from localStorage key "${key}":`, error)
    return null
  }
}

const safeLocalStorageSet = (key: string, value: string): boolean => {
  try {
    localStorage.setItem(key, value)
    return true
  } catch (error) {
    console.warn(`Failed to save to localStorage key "${key}":`, error)
    return false
  }
}

const safeLocalStorageRemove = (key: string): boolean => {
  try {
    localStorage.removeItem(key)
    return true
  } catch (error) {
    console.warn(`Failed to remove localStorage key "${key}":`, error)
    return false
  }
}

// Review data validation functions
const isValidReview = (review: any): review is Review => {
  return (
    review &&
    typeof review.id === 'string' &&
    typeof review.toolId === 'number' &&
    typeof review.userId === 'string' &&
    typeof review.userEmail === 'string' &&
    typeof review.rating === 'number' &&
    review.rating >= 1 && review.rating <= 5 &&
    typeof review.comment === 'string' &&
    review.comment.length >= 20 &&
    typeof review.date === 'string' &&
    typeof review.helpful === 'number'
  )
}

const loadValidReviews = (): Review[] => {
  const savedReviews = safeLocalStorageGet('osint-reviews')
  if (!savedReviews) return []
  
  try {
    const parsedReviews = JSON.parse(savedReviews)
    if (!Array.isArray(parsedReviews)) return []
    
    return parsedReviews.filter(isValidReview)
  } catch (error) {
    console.warn('Failed to parse reviews from localStorage:', error)
    return []
  }
}

// Input sanitization function
const sanitizeReviewText = (text: string): string => {
  return text
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .slice(0, 500) // Enforce max length
}

export default function OSINTDirectory() {
  // Tools state (dynamic from Supabase)
  const [tools, setTools] = useState<Tool[]>([])
  const [loadingTools, setLoadingTools] = useState(true)
  const [fetchError, setFetchError] = useState(false)

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("name-asc")
  const [favorites, setFavorites] = useState<number[]>([])
  const [recentlyViewed, setRecentlyViewed] = useState<number[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [compareMode, setCompareMode] = useState(false)
  const [selectedForComparison, setSelectedForComparison] = useState<number[]>([])
  const [showComparison, setShowComparison] = useState(false)

  // Auth state
  const [user, setUser] = useState<OsintUser | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authTab, setAuthTab] = useState("signin")
  const [authEmail, setAuthEmail] = useState("")
  const [authPassword, setAuthPassword] = useState("")
  const [authName, setAuthName] = useState("")
  const [authError, setAuthError] = useState("")
  const [authLoading, setAuthLoading] = useState(false)

  // Mock feature modals
  const [showCollections, setShowCollections] = useState(false)
  const [showSubmitTool, setShowSubmitTool] = useState(false)
  const [showAddReview, setShowAddReview] = useState(false)
  const [selectedToolForReview, setSelectedToolForReview] = useState<number | null>(null)

  // Advanced filter states
  const [pricingFilters, setPricingFilters] = useState({
    Free: false,
    Freemium: false,
    Paid: false,
  })
  const [noRegistrationFilter, setNoRegistrationFilter] = useState(false)
  const [statusFilters, setStatusFilters] = useState({
    online: false,
    warning: false,
    offline: false,
  })

  // Review state
  const [userReviews, setUserReviews] = useState<Review[]>(loadValidReviews())
  const [reviewText, setReviewText] = useState("")
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewError, setReviewError] = useState("")
  const [reviewLoading, setReviewLoading] = useState(false)

  // Fetch tools from Supabase on mount
  useEffect(() => {
    let isMounted = true
    setLoadingTools(true)
    setFetchError(false)

    const fetchTools = async () => {
      try {
        const { data, error } = await supabase
          .from('tools')
          .select('*')
        
        if (!isMounted) return
        
        if (error || !data) {
          setTools(fallbackTools)
          setFetchError(true)
        } else {
          setTools(data as unknown as Tool[])
        }
        setLoadingTools(false)
      } catch (err) {
        if (!isMounted) return
        console.warn('Error fetching tools:', err)
        setTools(fallbackTools)
        setFetchError(true)
        setLoadingTools(false)
      }
    }

    fetchTools()

    return () => { isMounted = false }
  }, [])

  // Load user, favorites and recently viewed from localStorage on mount
  useEffect(() => {
    const savedUser = safeLocalStorageGet("osint-user")
    const savedFavorites = safeLocalStorageGet("osint-favorites")
    const savedRecent = safeLocalStorageGet("osint-recent")
    const savedReviews = safeLocalStorageGet("osint-reviews")

    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
    if (savedRecent) {
      setRecentlyViewed(JSON.parse(savedRecent))
    }
    if (savedReviews) {
      setUserReviews(loadValidReviews())
    }
  }, [])

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    safeLocalStorageSet("osint-favorites", JSON.stringify(favorites))
  }, [favorites])

  // Save recently viewed to localStorage whenever it changes
  useEffect(() => {
    safeLocalStorageSet("osint-recent", JSON.stringify(recentlyViewed))
  }, [recentlyViewed])

  // Save reviews to localStorage whenever they change
  useEffect(() => {
    if (userReviews.length > 0) {
      const timeoutId = setTimeout(() => {
        safeLocalStorageSet("osint-reviews", JSON.stringify(userReviews))
      }, 100) // Debounce saves
      
      return () => clearTimeout(timeoutId)
    }
  }, [userReviews])

  // Auth functions
  const handleAuth = async () => {
    setAuthError("")
    setAuthLoading(true)

    // Basic validation
    if (!authEmail || !authPassword) {
      setAuthError("Please fill in all fields")
      setAuthLoading(false)
      return
    }

    if (authTab === "signup" && !authName) {
      setAuthError("Please enter your name")
      setAuthLoading(false)
      return
    }

    // Mock auth delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock successful auth
    const newUser: OsintUser = {
      id: Math.random().toString(36).substr(2, 9),
      email: authEmail,
      name: authTab === "signup" ? authName : authEmail.split("@")[0],
    }

    setUser(newUser)
    safeLocalStorageSet("osint-user", JSON.stringify(newUser))

    // Reset form
    setAuthEmail("")
    setAuthPassword("")
    setAuthName("")
    setAuthError("")
    setAuthLoading(false)
    setShowAuthModal(false)
  }

  const handleLogout = () => {
    setUser(null)
    safeLocalStorageRemove("osint-user")
  }

  const filteredTools = tools.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || tool.category === selectedCategory

    // Advanced filters
    const pricingFilterActive = Object.values(pricingFilters).some(Boolean)
    const matchesPricing = !pricingFilterActive || pricingFilters[tool.pricing as keyof typeof pricingFilters]

    const matchesRegistration = !noRegistrationFilter || !tool.registration

    const statusFilterActive = Object.values(statusFilters).some(Boolean)
    const matchesStatus = !statusFilterActive || statusFilters[tool.status as keyof typeof statusFilters]

    return matchesSearch && matchesCategory && matchesPricing && matchesRegistration && matchesStatus
  })

  // Sort tools based on selected option
  const sortedTools = [...filteredTools].sort((a, b) => {
    switch (sortBy) {
      case "name-asc":
        return a.name.localeCompare(b.name)
      case "name-desc":
        return b.name.localeCompare(a.name)
      case "category":
        return a.category.localeCompare(b.category)
      default:
        return 0
    }
  })

  const handleToolClick = (url: string, toolId: number) => {
    if (compareMode) return // Don't navigate in compare mode

    // Add to recently viewed (keep only last 5)
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((id) => id !== toolId)
      return [toolId, ...filtered].slice(0, 5)
    })

    window.open(url, "_blank")
  }

  const toggleFavorite = (toolId: number, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click
    setFavorites((prev) => (prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId]))
  }

  const toggleCompareSelection = (toolId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedForComparison((prev) => {
      if (prev.includes(toolId)) {
        return prev.filter((id) => id !== toolId)
      } else if (prev.length < 3) {
        return [...prev, toolId]
      }
      return prev
    })
  }

  const exportToCSV = () => {
    const headers = ["Name", "Category", "URL", "Pricing", "Registration Required"]
    const csvContent = [
      headers.join(","),
      ...sortedTools.map((tool) =>
        [tool.name, tool.category, tool.url, tool.pricing, tool.registration ? "Yes" : "No"].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `osint-tools-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const clearAllFilters = () => {
    setPricingFilters({ Free: false, Freemium: false, Paid: false })
    setNoRegistrationFilter(false)
    setStatusFilters({ online: false, warning: false, offline: false })
  }

  const handleAddReview = (toolId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedToolForReview(toolId)
    setShowAddReview(true)
  }

  const handleSubmitReview = async () => {
    if (!user || !selectedToolForReview) return

    setReviewError("")
    setReviewLoading(true)

    // Validation
    if (reviewRating === 0) {
      setReviewError("Please select a rating")
      setReviewLoading(false)
      return
    }

    if (!reviewText.trim() || reviewText.trim().length < 20) {
      setReviewError("Please enter a comment (minimum 20 characters)")
      setReviewLoading(false)
      return
    }

    if (reviewText.trim().length > 500) {
      setReviewError("Comment must be less than 500 characters")
      setReviewLoading(false)
      return
    }

    // Check for existing review by same user for same tool
    const existingReview = userReviews.find(
      (review) => review.toolId === selectedToolForReview && review.userId === user.id
    )

    if (existingReview) {
      setReviewError("You have already reviewed this tool")
      setReviewLoading(false)
      return
    }

    // Mock delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Create new review
    const newReview: Review = {
      id: Math.random().toString(36).substr(2, 9),
      toolId: selectedToolForReview,
      userId: user.id,
      userEmail: user.email,
      rating: reviewRating,
      comment: sanitizeReviewText(reviewText.trim()),
      date: new Date().toISOString(),
      helpful: 0,
    }

    // Add to reviews
    setUserReviews((prev) => {
      const updatedReviews = [...prev, newReview]
      // Attempt to save immediately to validate
      const saveSuccess = safeLocalStorageSet('osint-reviews', JSON.stringify(updatedReviews))
      if (!saveSuccess) {
        setReviewError("Failed to save review. Please try again.")
        setReviewLoading(false)
        return prev // Don't update state if save failed
      }
      return updatedReviews
    })

    // Reset form
    setReviewText("")
    setReviewRating(0)
    setReviewError("")
    setReviewLoading(false)
    setShowAddReview(false)
    setSelectedToolForReview(null)
  }

  const recentTools = recentlyViewed.map((id) => tools.find((tool) => tool.id === id)).filter(Boolean)
  const comparisonTools = selectedForComparison.map((id) => tools.find((tool) => tool.id === id)).filter(Boolean)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div className="text-center flex-1">
            <h1 className="text-5xl font-bold text-gray-900 mb-3 tracking-tight">OSINT Atlas</h1>
            <p className="text-gray-600 text-lg">Intelligence Tool Discovery Platform</p>
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCollections(true)}
                  className="bg-white border-gray-200 text-gray-700 hover:border-slate-300 hover:bg-gray-50 shadow-sm"
                >
                  My Collections
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white border-gray-200 text-gray-700 hover:border-slate-300 hover:bg-gray-50 shadow-sm"
                    >
                      <User className="w-4 h-4 mr-2" />
                      {user.name}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white border-gray-200 shadow-lg">
                    <DropdownMenuItem onClick={handleLogout} className="hover:bg-gray-50 focus:bg-gray-50 cursor-pointer">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAuthModal(true)}
                className="bg-white border-gray-200 text-gray-700 hover:border-slate-300 hover:bg-gray-50 shadow-sm px-6"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>

        {/* Stats Counter */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-sm border border-gray-100">
            <p className="text-gray-600">
              Showing <span className="text-slate-800 font-semibold">{sortedTools.length}</span> of{" "}
              <span className="text-slate-800 font-semibold">{tools.length}</span> tools
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-8 max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
          <Input
            placeholder="Search tools by name, description, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-12 py-3 text-base bg-white border-gray-200 rounded-lg shadow-sm focus:border-gray-300 focus:ring-gray-200 focus:ring-1 transition-all duration-200"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 z-10"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 items-center justify-center lg:justify-start w-full lg:w-auto">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-slate-700 text-white hover:bg-slate-800 shadow-sm"
                    : "bg-white border-gray-200 text-gray-700 hover:border-slate-300 hover:bg-gray-50"
                }`}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            {/* Advanced Filters */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="bg-white border-gray-200 text-gray-700 hover:border-slate-300 hover:bg-gray-50 min-w-[120px]"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {showFilters ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
            </Button>

            {/* Compare Mode */}
            <Button
              variant={compareMode ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setCompareMode(!compareMode)
                if (!compareMode) {
                  setSelectedForComparison([])
                }
              }}
              className={
                compareMode
                  ? "bg-slate-700 text-white hover:bg-slate-800 shadow-sm"
                  : "bg-white border-gray-200 text-gray-700 hover:border-slate-300 hover:bg-gray-50"
              }
            >
              Compare
            </Button>

            {/* Export */}
            <Button
              variant="outline"
              size="sm"
              onClick={exportToCSV}
              className="bg-white border-gray-200 text-gray-700 hover:border-slate-300 hover:bg-gray-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>

            {/* Sort Dropdown */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-44 bg-white border-gray-200 rounded-lg focus:border-slate-400 focus:ring-slate-400/20">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 rounded-md shadow-lg">
                <SelectItem value="name-asc" className="hover:bg-gray-50 focus:bg-gray-50">
                  Name A-Z
                </SelectItem>
                <SelectItem value="name-desc" className="hover:bg-gray-50 focus:bg-gray-50">
                  Name Z-A
                </SelectItem>
                <SelectItem value="category" className="hover:bg-gray-50 focus:bg-gray-50">
                  Category
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        <FilterPanel
          showFilters={showFilters}
          pricingFilters={pricingFilters}
          setPricingFilters={setPricingFilters}
          noRegistrationFilter={noRegistrationFilter}
          setNoRegistrationFilter={setNoRegistrationFilter}
          statusFilters={statusFilters}
          setStatusFilters={setStatusFilters}
          clearAllFilters={clearAllFilters}
        />

        {/* Compare Mode Controls */}
        <CompareControls
          compareMode={compareMode}
          selectedForComparison={selectedForComparison}
          setShowComparison={setShowComparison}
          setCompareMode={setCompareMode}
          setSelectedForComparison={setSelectedForComparison}
        />

        {/* Recently Viewed Section */}
        <RecentlyViewed
          recentTools={recentTools}
          compareMode={compareMode}
          handleToolClick={handleToolClick}
          userReviews={userReviews}
          mockReviews={mockReviews}
        />

        {/* Tools Grid */}
        {loadingTools ? (
          <div className="flex justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-slate-500" />
            <span className="ml-3 text-slate-500 text-lg">Loading tools...</span>
          </div>
        ) : fetchError ? (
          <div className="text-center py-12 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="text-2xl mb-2 opacity-60">⚠️</div>
            <p className="text-amber-800 font-medium mb-1">Unable to load tools from database</p>
            <p className="text-amber-600 text-sm">Using offline data - some tools may be outdated</p>
          </div>
        ) : null}
        
        {!loadingTools && (
          <ToolGrid
            tools={sortedTools}
            onToolClick={handleToolClick}
            onFavorite={toggleFavorite}
            onCompareSelection={toggleCompareSelection}
            onAddReview={handleAddReview}
            favorites={favorites}
            compareMode={compareMode}
            selectedForComparison={selectedForComparison}
            user={user}
            userReviews={userReviews}
            mockReviews={mockReviews}
          />
        )}

        {!loadingTools && sortedTools.length === 0 && (
          <div className="text-center py-24">
            <div className="text-6xl mb-6 opacity-20">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tools found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal
        showAuthModal={showAuthModal}
        setShowAuthModal={setShowAuthModal}
        authTab={authTab}
        setAuthTab={setAuthTab}
        authEmail={authEmail}
        setAuthEmail={setAuthEmail}
        authPassword={authPassword}
        setAuthPassword={setAuthPassword}
        authName={authName}
        setAuthName={setAuthName}
        authError={authError}
        authLoading={authLoading}
        handleAuth={handleAuth}
      />

      {/* Collections Modal */}
      <CollectionsModal
        showCollections={showCollections}
        setShowCollections={setShowCollections}
      />

      {/* Add Review Modal */}
      <ReviewModal
        showAddReview={showAddReview}
        setShowAddReview={setShowAddReview}
        selectedToolForReview={selectedToolForReview}
        tools={tools}
        user={user}
        userReviews={userReviews}
        setUserReviews={setUserReviews}
      />

      {/* Submit Tool Modal */}
      <SubmitToolModal
        showSubmitTool={showSubmitTool}
        setShowSubmitTool={setShowSubmitTool}
        categories={categories}
      />

      {/* Comparison Modal */}
      <ComparisonModal
        showComparison={showComparison}
        setShowComparison={setShowComparison}
        comparisonTools={comparisonTools}
        userReviews={userReviews}
        mockReviews={mockReviews}
      />

      {/* Footer */}
      <footer className="mt-24 border-t border-gray-200 bg-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-4 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">OSINT Atlas</h3>
                <span className="text-gray-300 text-sm">•</span>
                <p className="text-gray-600">Tool Discovery Platform</p>
              </div>
              <div className="flex items-center justify-center md:justify-start space-x-4 text-sm text-gray-500">
                <span>75 verified tools</span>
                <span>•</span>
                <span>Last updated: January 2025</span>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              {user && (
                <button
                  onClick={() => setShowSubmitTool(true)}
                  className="flex items-center space-x-1 hover:text-gray-700 transition-colors duration-200"
                >
                  <Plus className="w-4 h-4" />
                  <span>Submit Tool</span>
                </button>
              )}
              <Dialog>
                <DialogTrigger asChild>
                  <button className="flex items-center space-x-1 hover:text-gray-700 transition-colors duration-200">
                    <Info className="w-4 h-4" />
                    <span>About</span>
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>About OSINT Atlas</DialogTitle>
                  </DialogHeader>
                  <div className="mt-4 space-y-4 text-gray-600">
                    <p>
                      OSINT Atlas is a comprehensive directory of open-source intelligence tools designed for
                      researchers, investigators, and security professionals.
                    </p>
                    <p>
                      Our platform curates and organizes the most effective OSINT tools across multiple categories,
                      providing detailed information about pricing, registration requirements, and current status.
                    </p>
                    <p>
                      Built for the OSINT community, OSINT Atlas helps professionals discover the right tools for their
                      investigations and research needs.
                    </p>
                  </div>
                </DialogContent>
              </Dialog>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 hover:text-gray-700 transition-colors duration-200"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
