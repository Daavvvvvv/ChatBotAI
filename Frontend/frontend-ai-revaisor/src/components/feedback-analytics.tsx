"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { feedbackApi, FeedbackResponse } from "@/lib/feedbackApi";
import StarIcon from "@/components/ui/staricon";


/**
 * FeedbackAnalytics component fetches and displays feedback data using charts and tables.
 * It includes a bar chart for rating distribution, pie charts for model and assistant type distribution,
 * and a table for recent feedback entries.
 */
export default function FeedbackAnalytics() {
  const [feedback, setFeedback] = useState<FeedbackResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setLoading(true);
        const data = await feedbackApi.getFeedback();
        setFeedback(data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch feedback data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  // Process data for charts
  const ratingCounts = [0, 0, 0, 0, 0]; // For ratings 1-5
  feedback.forEach((item) => {
    if (item.rating >= 1 && item.rating <= 5) {
      ratingCounts[item.rating - 1]++;
    }
  });

  const ratingData = [
    { name: "1 Star", count: ratingCounts[0] },
    { name: "2 Stars", count: ratingCounts[1] },
    { name: "3 Stars", count: ratingCounts[2] },
    { name: "4 Stars", count: ratingCounts[3] },
    { name: "5 Stars", count: ratingCounts[4] },
  ];

  // Model type data
  const modelTypeCount: Record<string, number> = {};
  feedback.forEach((item) => {
    modelTypeCount[item.modelType] = (modelTypeCount[item.modelType] || 0) + 1;
  });

  const modelTypeData = Object.entries(modelTypeCount).map(([name, value]) => ({
    name,
    value,
  }));

  // Assistant type data
  const assistantTypeCount: Record<string, number> = {};
  feedback.forEach((item) => {
    assistantTypeCount[item.assistantType] =
      (assistantTypeCount[item.assistantType] || 0) + 1;
  });

  const assistantTypeData = Object.entries(assistantTypeCount).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  // Average rating by model
  const modelRatings: Record<string, { total: number; count: number }> = {};
  feedback.forEach((item) => {
    if (!modelRatings[item.modelType]) {
      modelRatings[item.modelType] = { total: 0, count: 0 };
    }
    modelRatings[item.modelType].total += item.rating;
    modelRatings[item.modelType].count += 1;
  });

  const avgModelRatingData = Object.entries(modelRatings).map(
    ([name, data]) => ({
      name,
      avgRating: data.total / data.count,
    })
  );

  // Pie chart colors
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82ca9d",
  ];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Feedback Analytics</h1>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-lg">Loading feedback data...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Rating Distribution Card */}
          <Card>
            <CardHeader>
              <CardTitle>Rating Distribution</CardTitle>
              <CardDescription>
                Distribution of user ratings (1-5 stars)
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ratingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="count"
                    fill="#8884d8"
                    name="Number of Ratings"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Model Distribution Card */}
          <Card>
            <CardHeader>
              <CardTitle>Feedback by Model</CardTitle>
              <CardDescription>
                Distribution of feedback by AI model
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={modelTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value">
                    {modelTypeData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [
                      `${value} feedback entries`,
                      "Count",
                    ]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Average Rating by Model */}
          <Card>
            <CardHeader>
              <CardTitle>Average Rating by Model</CardTitle>
              <CardDescription>
                Average user rating for each AI model
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={avgModelRatingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="avgRating"
                    fill="#82ca9d"
                    name="Average Rating"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Assistant Type Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Feedback by Assistant Type</CardTitle>
              <CardDescription>
                Distribution of feedback by assistant type
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={assistantTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value">
                    {assistantTypeData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [
                      `${value} feedback entries`,
                      "Count",
                    ]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recent Feedback Table */}
          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle>Recent Feedback</CardTitle>
              <CardDescription>
                Most recent user feedback and comments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>Assistant Type</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Comments</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feedback.slice(0, 10).map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        {new Date(item.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{item.modelType}</TableCell>
                      <TableCell>{item.assistantType}</TableCell>
                      <TableCell>
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`h-4 w-4 ${
                                i < item.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {item.comments || "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                  {feedback.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        No feedback data available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
