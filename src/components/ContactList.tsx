
import { Search, MoreHorizontal, Edit, MessageCircle, Users } from "lucide-react";
import { useState } from "react";
import CreateGroupDialog from "./CreateGroupDialog";

interface Contact {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  lastMessage: string;
  timestamp: string;
  isGroup?: boolean;
  members?: Contact[];
}

interface ContactListProps {
  contacts: Contact[];
  selectedContact: Contact;
  onSelectContact: (contact: Contact) => void;
  onCreateGroup: (name: string, members: Contact[]) => void;
}

const ContactList = ({ contacts, selectedContact, onSelectContact, onCreateGroup }: ContactListProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-white">Messages</h1>
          <div className="flex space-x-2">
            <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
              <Edit className="w-5 h-5 text-white/80" />
            </button>
            <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
              <MoreHorizontal className="w-5 h-5 text-white/80" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-sky-400/50 transition-all"
          />
        </div>
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {filteredContacts.map((contact) => (
          <div
            key={contact.id}
            onClick={() => onSelectContact(contact)}
            className={`p-4 cursor-pointer transition-all duration-200 hover:bg-white/5 ${
              selectedContact.id === contact.id ? 'bg-white/10 border-r-2 border-sky-400' : ''
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                {contact.isGroup ? (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600/20 to-sky-500/20 border border-white/20 flex items-center justify-center">
                    <Users className="w-6 h-6 text-white/80" />
                  </div>
                ) : (
                  <>
                    <img
                      src={contact.avatar}
                      alt={contact.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {contact.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full online-pulse"></div>
                    )}
                  </>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-white truncate">{contact.name}</h3>
                    {contact.isGroup && (
                      <span className="text-xs text-white/50 bg-white/10 px-2 py-0.5 rounded-full">
                        {contact.members?.length || 0} members
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-white/50">{contact.timestamp}</span>
                </div>
                <p className="text-sm text-white/70 truncate mt-1">{contact.lastMessage}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <CreateGroupDialog 
          contacts={contacts.filter(c => !c.isGroup)}
          onCreateGroup={onCreateGroup}
        />
        <button className="w-full flex items-center justify-center space-x-2 p-3 bg-gradient-to-r from-blue-600/20 to-sky-500/20 hover:from-blue-600/30 hover:to-sky-500/30 rounded-xl transition-all duration-300 hover-lift">
          <MessageCircle className="w-5 h-5 text-white/80" />
          <span className="text-white/80 font-medium">New Message</span>
        </button>
      </div>
    </div>
  );
};

export default ContactList;
