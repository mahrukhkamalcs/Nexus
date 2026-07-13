import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  Users,
  Calendar,
} from "lucide-react";
import { Card, CardHeader, CardBody } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Avatar } from "../../components/ui/Avatar";

import {
  getDeals,
  createDeal,
} from "../../api/dealApi";

export const DealsPage: React.FC = () => {
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    try {
      const data = await getDeals();
      setDeals(data);
    } catch (error) {
      console.error("Error loading deals:", error);
    } finally {
      setLoading(false);
    }
  };

  const statuses = [
    "Due Diligence",
    "Term Sheet",
    "Negotiation",
    "Closed",
    "Passed",
  ];

  const toggleStatus = (status: string) => {
    setSelectedStatus((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Due Diligence":
        return "primary";

      case "Term Sheet":
        return "secondary";

      case "Negotiation":
        return "accent";

      case "Closed":
        return "success";

      case "Passed":
        return "error";

      default:
        return "gray";
    }
  };

  const filteredDeals = deals.filter((deal) => {
    const matchesSearch =
      searchQuery === "" ||
      deal.startup?.name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      deal.startup?.industry
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatus.length === 0 ||
      selectedStatus.includes(deal.status);

    return matchesSearch && matchesStatus;
  });

  const handleAddDeal = async () => {
    try {
      const newDeal = {
        startup: {
          name: "New Startup",
          logo:
            "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
          industry: "Technology",
        },
        amount: "$500K",
        equity: "10%",
        status: "Negotiation",
        stage: "Seed",
        lastActivity: new Date(),
      };

      await createDeal(newDeal);

      loadDeals();
    } catch (error) {
      console.error(error);
    }
  };
  return (
  <div className="space-y-6 animate-fade-in">
    {/* Header */}
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Investment Deals</h1>
        <p className="text-gray-600">
          Track and manage your investment pipeline
        </p>
      </div>

      <Button onClick={handleAddDeal}>Add Deal</Button>
    </div>

    {/* Loading Toggle */}
    {loading ? (
      <div className="flex justify-center items-center py-16">
        <p className="text-gray-500">Loading deals...</p>
      </div>
    ) : (
      <>
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardBody>
              <div className="flex items-center">
                <div className="p-3 bg-primary-100 rounded-lg mr-3">
                  <DollarSign size={20} className="text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Investment</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {deals.length}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-center">
                <div className="p-3 bg-secondary-100 rounded-lg mr-3">
                  <TrendingUp size={20} className="text-secondary-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Deals</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {deals.filter((deal) => deal.status !== "Closed").length}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-center">
                <div className="p-3 bg-accent-100 rounded-lg mr-3">
                  <Users size={20} className="text-accent-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Portfolio Companies</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {deals.length}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-center">
                <div className="p-3 bg-success-100 rounded-lg mr-3">
                  <Calendar size={20} className="text-success-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Closed Deals</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {deals.filter((deal) => deal.status === "Closed").length}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-2/3">
            <Input
              placeholder="Search deals by startup name or industry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startAdornment={<Search size={18} />}
              fullWidth
            />
          </div>

          <div className="w-full md:w-1/3">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-500" />
              <div className="flex flex-wrap gap-2">
                {statuses.map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => toggleStatus(status)}
                  >
                    <Badge
                      variant={
                        selectedStatus.includes(status)
                          ? getStatusColor(status)
                          : "gray"
                      }
                    >
                      {status}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Deals Table */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium text-gray-900">Active Deals</h2>
          </CardHeader>

          <CardBody>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Startup
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Equity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Stage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Last Activity
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {filteredDeals.length > 0 ? (
                    filteredDeals.map((deal) => (
                      <tr
                        key={deal.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Avatar
                              src={deal.startup.logo}
                              alt={deal.startup.name}
                              size="sm"
                              className="flex-shrink-0"
                            />
                            <div className="ml-4">
                              <div className="text-sm font-semibold text-gray-900">
                                {deal.startup.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {deal.startup.industry}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-medium text-green-600">
                            {deal.amount}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {deal.equity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={getStatusColor(deal.status)}>
                            {deal.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {deal.stage}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {new Date(deal.lastActivity).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-12 text-center text-gray-500"
                      >
                        <div className="flex flex-col items-center">
                          <DollarSign
                            size={40}
                            className="text-gray-300 mb-3"
                          />
                          <h3 className="text-lg font-medium text-gray-700">
                            No Deals Found
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Try changing your search or selected status filters.
                          </p>
                          <Button
                            className="mt-4"
                            variant="outline"
                            onClick={() => {
                              setSearchQuery("");
                              setSelectedStatus([]);
                            }}
                          >
                            Clear Filters
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </>
    )}
  </div>
);
};