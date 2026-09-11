import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Network, Layers, ShieldCheck, Activity, Terminal } from 'lucide-react';

interface NetworkingVisualizerWorkspaceProps {
  topicId?: string;
  programId?: string;
}

export const NetworkingVisualizerWorkspace: React.FC<NetworkingVisualizerWorkspaceProps> = ({ topicId = 'osi_model' }) => {
  const navigate = useNavigate();

  // Topic Metadata map for all 8 foundational networking topics
  const topicMap: Record<string, {
    title: string;
    category: string;
    layer: string;
    description: string;
    standard: string;
    keyPoints: string[];
    metrics: { label: string; value: string }[];
  }> = {
    osi_model: {
      title: '01. OSI 7-Layer Model',
      category: 'Architecture · Protocol Stack',
      layer: 'Layers 1 - 7 (Physical to Application)',
      description: 'ISO/IEC 7498-1 standard reference model defining communication functions into 7 modular abstract layers.',
      standard: 'ISO/IEC 7498',
      keyPoints: [
        'Layer 7-5: Application, Presentation, Session (Data & Encodings)',
        'Layer 4: Transport (Segments, Ports, TCP/UDP Flow Control)',
        'Layer 3: Network (Packets, Logical IP Addressing, Routing)',
        'Layer 2: Data Link (Frames, Physical MAC Addressing, Error Detection)',
        'Layer 1: Physical (Bits, Voltage Signals, Cables, Radio Frequencies)',
      ],
      metrics: [
        { label: 'PDU UNITS', value: 'Data → Seg → Pkt → Frame → Bits' },
        { label: 'LAYERS', value: '7 Modular Tiers' },
        { label: 'STANDARDS', value: 'ISO / OSI' },
      ],
    },
    tcp_ip_model: {
      title: '02. TCP/IP 4-Layer Suite',
      category: 'Architecture · Internet Suite',
      layer: 'DoD 4-Layer Protocol Stack',
      description: 'The real-world implementation suite powering the global Internet: Application, Transport, Internet, and Link.',
      standard: 'RFC 1122',
      keyPoints: [
        'Application Layer: HTTP, DNS, SSH, FTP, SMTP protocols',
        'Transport Layer: End-to-end host communication via TCP and UDP',
        'Internet Layer: Routing & internetworking via IPv4, IPv6, ICMP, ARP',
        'Network Access: Hardware frame encapsulation (Ethernet, Wi-Fi)',
      ],
      metrics: [
        { label: 'MODEL', value: '4 Layers (DoD)' },
        { label: 'CORE PROTOCOL', value: 'IPv4 / IPv6' },
        { label: 'ROUTING', value: 'Packet Switching' },
      ],
    },
    network_topologies: {
      title: '03. Network Topologies',
      category: 'Physical & Data Link · Topologies',
      layer: 'Physical (L1) & Data Link (L2)',
      description: 'Geometric arrangement of nodes, devices, and communication links in a computer network infrastructure.',
      standard: 'IEEE 802.3 / 802.11',
      keyPoints: [
        'Star Topology: Central switch or hub; single cable failure does not drop entire network',
        'Mesh Topology: Full or partial point-to-point redundancy with highest fault tolerance',
        'Bus Topology: Single shared coaxial backbone with terminators at both ends',
        'Ring Topology: Token passing in a closed circular data loop',
      ],
      metrics: [
        { label: 'CABLING', value: 'Twisted Pair / Fiber' },
        { label: 'REDUNDANCY', value: 'Highest in Full Mesh' },
        { label: 'MODES', value: 'Star, Mesh, Bus, Ring' },
      ],
    },
    ipv4_addressing: {
      title: '04. IPv4 Addressing & Classes',
      category: 'Addressing · Logical Network',
      layer: 'Network Layer (L3)',
      description: '32-bit unique identifier formatted in dotted-decimal notation (4 octets of 8 bits) divided into address classes.',
      standard: 'RFC 791',
      keyPoints: [
        'Class A: 1.0.0.0 - 126.255.255.255 (/8, Large enterprise)',
        'Class B: 128.0.0.0 - 191.255.255.255 (/16, Mid-size networks)',
        'Class C: 192.0.0.0 - 223.255.255.255 (/24, Small local networks)',
        'Private Ranges: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16 (RFC 1918)',
      ],
      metrics: [
        { label: 'TOTAL SPACE', value: '2³² (~4.29 Billion IPs)' },
        { label: 'BIT WIDTH', value: '32 Bits (4 Octets)' },
        { label: 'LOOPBACK', value: '127.0.0.1' },
      ],
    },
    tcp_vs_udp: {
      title: '05. TCP vs UDP Protocols',
      category: 'Transport · End-to-End Delivery',
      layer: 'Transport Layer (L4)',
      description: 'Comparative analysis of connection-oriented reliable byte streams versus connectionless low-latency datagrams.',
      standard: 'RFC 793 (TCP) / RFC 768 (UDP)',
      keyPoints: [
        'TCP: Connection-oriented, 3-way handshake, guaranteed delivery, ordered byte stream, congestion control',
        'UDP: Connectionless, zero handshake overhead, no packet retransmissions, ideal for streaming & gaming',
        'Header Overhead: TCP has 20-60 bytes header; UDP has a lightweight 8 bytes header',
      ],
      metrics: [
        { label: 'TCP HEADER', value: '20 - 60 Bytes' },
        { label: 'UDP HEADER', value: '8 Bytes (Fixed)' },
        { label: 'RELIABILITY', value: 'TCP=High, UDP=Best Effort' },
      ],
    },
    subnetting_cidr: {
      title: '06. Subnetting & CIDR Basics',
      category: 'Addressing · Network Partitioning',
      layer: 'Network Layer (L3)',
      description: 'Classless Inter-Domain Routing (CIDR) and subnet masking to logically divide physical networks into smaller subnets.',
      standard: 'RFC 1519 / RFC 4632',
      keyPoints: [
        'Slash Notation (/n): Count of consecutive binary 1s denoting Network Bits',
        'Host Bits (32 - n): Remaining bits allocated for host devices (2^(32-n) - 2 usable)',
        'Network ID: First IP in subnet (all host bits 0)',
        'Broadcast ID: Last IP in subnet (all host bits 1)',
      ],
      metrics: [
        { label: 'STANDARD /24', value: '254 Usable Hosts' },
        { label: 'STANDARD /27', value: '30 Usable Hosts' },
        { label: 'MASK FORMAT', value: '255.255.255.0' },
      ],
    },
    tcp_handshake: {
      title: '07. TCP 3-Way Handshake',
      category: 'Transport · Connection State',
      layer: 'Transport Layer (L4)',
      description: 'SYN, SYN-ACK, ACK sequence establishing synchronized sequence numbers and window sizing between client and server.',
      standard: 'RFC 793 / RFC 9293',
      keyPoints: [
        'Step 1 (SYN): Client sends SYN packet with Initial Sequence Number (ISN_c)',
        'Step 2 (SYN-ACK): Server replies with SYN-ACK, acknowledging ISN_c+1 and offering ISN_s',
        'Step 3 (ACK): Client replies with ACK (seq=ISN_c+1, ack=ISN_s+1), connection ESTABLISHED',
        'Teardown (FIN-ACK): Four-way wave or piggybacked FIN termination when session ends',
      ],
      metrics: [
        { label: 'RTT COST', value: '1 Full Round Trip' },
        { label: 'FLAGS', value: 'SYN, ACK, FIN, RST' },
        { label: 'STATE', value: 'LISTEN → SYN_SENT → ESTAB' },
      ],
    },
    dns_resolution: {
      title: '08. DNS Resolution Lifecycle',
      category: 'Application · Name Translation',
      layer: 'Application Layer (L7)',
      description: 'Distributed hierarchical naming system translating human-friendly hostnames (e.g. example.com) to machine IP addresses.',
      standard: 'RFC 1034 / RFC 1035',
      keyPoints: [
        'Client Query: OS checks local cache / hosts file, then queries Recursive Resolver',
        'Root Server (.): Directs resolver to Top-Level Domain (TLD) server (.com, .org, .edu)',
        'TLD Server: Directs resolver to the domain authoritative name server',
        'Authoritative Server: Returns the DNS record (A, AAAA, CNAME, MX) to client with TTL',
      ],
      metrics: [
        { label: 'DEFAULT PORT', value: 'UDP 53 (TCP >512B)' },
        { label: 'HIERARCHY', value: 'Root → TLD → Authoritative' },
        { label: 'RECORD TYPES', value: 'A, AAAA, CNAME, MX, TXT' },
      ],
    },
  };

  const currentTopic = topicMap[topicId] || topicMap['osi_model'];

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#07090e] text-slate-100 select-none">
      {/* Blueprint Header */}
      <header className="flex items-center justify-between px-6 py-3.5 border-b border-slate-800/80 bg-[#0c1017]/90 backdrop-blur-md shrink-0 z-20">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/topics/networking')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white text-xs font-mono font-medium transition-colors border border-slate-700/60"
            title="Back to Topics"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Topics</span>
          </button>

          <div className="h-4 w-px bg-slate-800" />

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400">
              <Network className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-black text-white tracking-tight font-mono">{currentTopic.title}</h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/15 border border-sky-500/30 text-sky-400 font-bold">
                  {currentTopic.layer}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">{currentTopic.category}</p>
            </div>
          </div>
        </div>

        {/* Quick Topic Switcher & Meta */}
        <div className="flex items-center gap-3">
          <select
            value={topicId}
            onChange={(e) => navigate(`/visualizer/networking/${e.target.value}/net_${e.target.value}`)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono font-medium text-slate-200 hover:border-sky-500/50 focus:outline-none focus:border-sky-500 transition-colors"
          >
            {Object.entries(topicMap).map(([id, t]) => (
              <option key={id} value={id} className="bg-slate-900 text-slate-200">
                {t.title}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{currentTopic.standard}</span>
          </div>
        </div>
      </header>

      {/* Main Engineering Workspace */}
      <main className="flex-1 flex overflow-hidden p-6 gap-6 relative">
        {/* Dot-matrix Grid Background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: 'radial-gradient(rgba(14, 165, 233, 0.4) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Left Column: Interactive Topology / Blueprint Stage */}
        <section className="flex-1 flex flex-col rounded-xl border border-slate-800 bg-[#0b0e14]/90 backdrop-blur-md overflow-hidden relative shadow-2xl">
          {/* Stage Top Bar */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800/80 bg-[#0e131d] text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-sky-400" />
              <span className="font-bold text-slate-200 uppercase tracking-wider">Interactive Protocol Stage</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">SIMULATION_READY</span>
          </div>

          {/* Blueprint Canvas */}
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative overflow-y-auto">
            {/* Architectural Diagram Schematic */}
            <div className="w-full max-w-2xl p-6 rounded-2xl border border-sky-500/20 bg-slate-950/60 shadow-inner mb-6">
              <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-sky-500/20 border border-sky-500 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">Protocol Architecture Blueprint</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">LAYER SPECIFICATION</span>
              </div>

              {/* Blueprint Key Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
                {currentTopic.keyPoints.map((point, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-slate-900/80 border border-slate-800/80 hover:border-sky-500/30 transition-colors"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="text-[10px] font-mono font-black text-sky-400 mt-0.5">#{String(idx + 1).padStart(2, '0')}</span>
                      <p className="text-xs font-mono text-slate-300 leading-relaxed">{point}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stage Status Footnote */}
            <p className="text-xs font-mono text-slate-400 max-w-lg mb-4">
              {currentTopic.description}
            </p>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-950/40 border border-sky-500/30 text-sky-300 text-xs font-mono">
              <Layers className="w-3.5 h-3.5 text-sky-400" />
              <span>Dedicated Interactive Packet Canvas Primed</span>
            </div>
          </div>
        </section>

        {/* Right Column: Telemetry & Technical Metrics Panel */}
        <aside className="w-80 flex flex-col rounded-xl border border-slate-800 bg-[#0b0e14]/90 backdrop-blur-md overflow-hidden shrink-0 shadow-2xl">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-800/80 bg-[#0e131d] text-xs font-mono text-slate-400">
            <Terminal className="w-3.5 h-3.5 text-sky-400" />
            <span className="font-bold text-slate-200 uppercase tracking-wider">Protocol Telemetry</span>
          </div>

          <div className="flex-1 p-4 space-y-4 overflow-y-auto font-mono text-xs">
            {/* Metrics List */}
            <div className="space-y-2.5">
              <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Metrics & Sizing</span>
              {currentTopic.metrics.map((m, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">{m.label}</div>
                  <div className="text-xs font-black text-sky-400 mt-0.5">{m.value}</div>
                </div>
              ))}
            </div>

            {/* Quick Topic Navigation Links */}
            <div className="pt-3 border-t border-slate-800">
              <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider block mb-2.5">Foundational Topics</span>
              <div className="space-y-1.5">
                {Object.entries(topicMap).map(([id, t]) => {
                  const active = id === topicId;
                  return (
                    <button
                      key={id}
                      onClick={() => navigate(`/visualizer/networking/${id}/net_${id}`)}
                      className={`w-full text-left px-2.5 py-1.5 rounded text-[11px] font-mono font-medium transition-colors flex items-center justify-between ${
                        active
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                          : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                      }`}
                    >
                      <span className="truncate">{t.title}</span>
                      {active && <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};
