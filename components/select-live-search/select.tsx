import React, { useState } from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const SearchableSelect = () => {
  const [selectedValue, setSelectedValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const items = [
    { label: "Jakarta", value: "jakarta" },
    { label: "Surabaya", value: "surabaya" },
    { label: "Bandung", value: "bandung" },
    { label: "Medan", value: "medan" },
    { label: "Semarang", value: "semarang" }
  ];

  const filteredItems = items.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    
  );
};

export default SearchableSelect;