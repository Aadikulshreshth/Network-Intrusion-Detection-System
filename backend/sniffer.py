from scapy.all import sniff, IP, TCP, UDP
from collections import defaultdict
import threading

data_lock = threading.Lock()
flows = defaultdict(list)

def packet_callback(packet):
    if IP in packet:
        proto = "TCP" if TCP in packet else "UDP" if UDP in packet else "OTHER"
        key = (packet[IP].src, packet[IP].dst, proto)
        
        with data_lock:
            flows[key].append(packet)
            
            if len(flows[key]) % 500 == 0:
                print(f"Monitoring Flow: {key[0]} -> {key[1]} | {len(flows[key])} pkts")

def start_sniffing():
    TARGET_IP = "10.24.84.121"
    
    print(f"Sniffer active. Filtering ONLY for host: {TARGET_IP}")
    
    sniff(filter=f"host {TARGET_IP}", prn=packet_callback, store=0)

if __name__ == "__main__":
    start_sniffing()