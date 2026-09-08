// Extensible GIS Network Routing Service Interface for GeoVision / SmartMap

export const routingService = {
  /**
   * Check if authoritative GIS network routing service is configured and accessible
   */
  isAvailable() {
    // Currently, network routing dataset is not connected to client open-data REST endpoint.
    // Explicitly returns false to prevent fabricating fake routes.
    return false;
  },

  /**
   * Calculate route between origin and destination
   */
  async calculateRoute(origin, destination) {
    if (!this.isAvailable()) {
      return {
        success: false,
        available: false,
        message: "Directions are not currently available because no authoritative GIS network routing service is configured for this sector.",
        message_ar: "خدمة الاتجاهات الجغرافية غير متاحة حالياً لعدم تكوين شبكة مسارات مكانية معتمدة لهذا القطاع.",
        origin,
        destination
      };
    }

    // Future GIS Network Service Integration Placeholder
    return null;
  }
};
