import React, { useEffect, useState } from 'react';
import { Search, Filter, MapPin } from 'lucide-react';
import { getInvestors } from '../../api/users';
import { Investor } from '../../types';
import { Input } from '../../components/ui/Input';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { InvestorCard } from '../../components/investor/InvestorCard';

export const InvestorsPage: React.FC = () => {
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStages, setSelectedStages] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  useEffect(() => {
    loadInvestors();
  }, []);

  const loadInvestors = async () => {
    try {
      const data = await getInvestors();
      setInvestors(data || []);
    } catch (err) {
      console.error('Error fetching investors:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Dynamic compilation of active unique filter segments from current data
  const allStages = Array.from(new Set(investors.flatMap(i => i.investmentStage || [])));
  const allInterests = Array.from(new Set(investors.flatMap(i => i.investmentInterests || [])));
  
  // Filter investors based on search input and filter configurations
  const filteredInvestors = investors.filter(investor => {
    const matchesSearch = searchQuery === '' || 
      (investor.name && investor.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (investor.bio && investor.bio.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (investor.investmentInterests && investor.investmentInterests.some(interest => 
        interest.toLowerCase().includes(searchQuery.toLowerCase())
      ));
    
    const matchesStages = selectedStages.length === 0 ||
      (investor.investmentStage && investor.investmentStage.some(stage => selectedStages.includes(stage)));
    
    const matchesInterests = selectedInterests.length === 0 ||
      (investor.investmentInterests && investor.investmentInterests.some(interest => selectedInterests.includes(interest)));
    
    return matchesSearch && matchesStages && matchesInterests;
  });
  
  const toggleStage = (stage: string) => {
    setSelectedStages(prev => 
      prev.includes(stage)
        ? prev.filter(s => s !== stage)
        : [...prev, stage]
    );
  };
  
  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Find Investors</h1>
        <p className="text-gray-600">Connect with investors who match your startup's needs</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">Filters</h2>
            </CardHeader>
            <CardBody className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Investment Stage</h3>
                <div className="space-y-2">
                  {!loading && allStages.length === 0 ? (
                    <p className="text-xs text-gray-400 italic">No stages detected</p>
                  ) : (
                    allStages.map(stage => (
                      <button
                        key={stage}
                        type="button"
                        onClick={() => toggleStage(stage)}
                        className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                          selectedStages.includes(stage)
                            ? 'bg-primary-50 text-primary-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {stage}
                      </button>
                    ))
                  )}
                </div>
              </div>
              
              <div>
  <h3 className="text-sm font-medium text-gray-900 mb-2">Investment Interests</h3>
  <div className="flex flex-wrap gap-2">
    {!loading && allInterests.length === 0 ? (
      <p className="text-xs text-gray-400 italic">No interest fields found</p>
    ) : (
      allInterests.map((interest: string) => (
        <span
          key={interest}
          onClick={() => toggleInterest(interest)}
          className="cursor-pointer select-none"
        >
          <Badge
            variant={selectedInterests.includes(interest) ? 'primary' : 'gray'}
          >
            {interest}
          </Badge>
        </span>
      ))
    )}
  </div>
</div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Location</h3>
                <div className="space-y-2">
                  <button type="button" className="flex items-center w-full text-left px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                    <MapPin size={16} className="mr-2 text-gray-400" />
                    San Francisco, CA
                  </button>
                  <button type="button" className="flex items-center w-full text-left px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                    <MapPin size={16} className="mr-2 text-gray-400" />
                    New York, NY
                  </button>
                  <button type="button" className="flex items-center w-full text-left px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                    <MapPin size={16} className="mr-2 text-gray-400" />
                    Boston, MA
                  </button>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
        
        {/* Main content area */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <div className="flex-1">
              <Input
                placeholder="Search investors by name, interests, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                startAdornment={<Search size={18} className="text-gray-400" />}
                fullWidth
              />
            </div>
            
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <Filter size={18} className="text-gray-400" />
              <span className="text-sm text-gray-600 whitespace-nowrap">
                {loading ? 'Analyzing...' : `${filteredInvestors.length} results`}
              </span>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-3 text-gray-500">Loading dynamic configurations...</span>
            </div>
          ) : filteredInvestors.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed">
              <p className="text-gray-500 font-medium">No professional investor profiles match your criteria.</p>
              <button 
                type="button"
                onClick={() => { setSearchQuery(''); setSelectedStages([]); setSelectedInterests([]); }}
                className="mt-2 text-sm text-primary-600 font-semibold hover:underline"
              >
                Clear active filter query overrides
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredInvestors.map(investor => (
                <InvestorCard
                  key={investor.id || investor.id}
                  investor={investor}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};