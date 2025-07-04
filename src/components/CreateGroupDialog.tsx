import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Users, Check } from "lucide-react";

interface Contact {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
}

interface CreateGroupDialogProps {
  contacts: Contact[];
  onCreateGroup: (name: string, members: Contact[]) => void;
}

const CreateGroupDialog = ({ contacts, onCreateGroup }: CreateGroupDialogProps) => {
  const [open, setOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<Contact[]>([]);

  const handleMemberToggle = (contact: Contact, checked: boolean) => {
    if (checked) {
      setSelectedMembers(prev => [...prev, contact]);
    } else {
      setSelectedMembers(prev => prev.filter(member => member.id !== contact.id));
    }
  };

  const handleCreate = () => {
    if (groupName.trim() && selectedMembers.length > 0) {
      onCreateGroup(groupName.trim(), selectedMembers);
      setGroupName("");
      setSelectedMembers([]);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full flex items-center justify-center space-x-2 p-3 bg-gradient-to-r from-blue-600/20 to-sky-500/20 hover:from-blue-600/30 hover:to-sky-500/30 rounded-xl transition-all duration-300 hover-lift">
          <Users className="w-5 h-5 text-white/80" />
          <span className="text-white/80 font-medium">Create Group</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="glass-card border border-white/20 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Create Group Chat</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="groupName" className="text-white/80">Group Name</Label>
            <Input
              id="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name..."
              className="bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-sky-400/50"
            />
          </div>
          
          <div>
            <Label className="text-white/80 mb-3 block">Add Members</Label>
            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
              {contacts.map((contact) => (
                <div key={contact.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5">
                  <Checkbox
                    id={`member-${contact.id}`}
                    checked={selectedMembers.some(member => member.id === contact.id)}
                    onCheckedChange={(checked) => handleMemberToggle(contact, checked as boolean)}
                    className="border-white/30"
                  />
                  <img
                    src={contact.avatar}
                    alt={contact.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-white text-sm">{contact.name}</p>
                    <p className="text-white/50 text-xs">
                      {contact.isOnline ? "Online" : "Offline"}
                    </p>
                  </div>
                  {selectedMembers.some(member => member.id === contact.id) && (
                    <Check className="w-4 h-4 text-green-400" />
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 border-white/20 text-white/80 hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!groupName.trim() || selectedMembers.length === 0}
              className="flex-1 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600"
            >
              Create Group
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupDialog;